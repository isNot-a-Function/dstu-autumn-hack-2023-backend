import { FastifyRequest, FastifyReply } from 'fastify';
import { ZodError } from 'zod';

import prisma from '../../prisma';

import { verifyAccessToken } from '../../integrations/jwt';
import { logger } from '../../log';

import { SuccessReply } from '../../reply/success.reply';
import { ErrorReply } from '../../reply/error.reply';
import { CreateTaskSchema, GetTasksSchema } from './validator';
import { ICreateTask, IGetTasks } from './interface';

export const CreateTaskController = async (
  req: FastifyRequest<{ Body: ICreateTask }>,
  reply: FastifyReply,
) => {
  try {
    if (!req.headers.authorization) {
      reply
        .status(ErrorReply.TokenIsNotExistErrorStatus);

      return;
    }

    const user = verifyAccessToken(req.headers.authorization);

    if (typeof user === 'string') {
      reply
        .status(ErrorReply.TokenIsInvalidErrorStatus);

      return;
    }

    if (user.role !== 'hr') {
      reply
        .status(ErrorReply.AccessDeniedErrorStatus)
        .send({
          message: ErrorReply.AccessDeniedErrorMessage,
        });

      return;
    }

    const data = CreateTaskSchema.parse(req.body);

    const task = await prisma.task.create({
      data: {
        correctMultipleAnswer: data.type === 'multipleResponse' ? data.correctAnswer : undefined,
        correctSingleAnswer: data.type === 'singleResponse' ? data.correctAnswer[0] : undefined,
        question: data.question,
        type: data.type,
        variants: data.variants,
      },
    });

    reply
      .status(SuccessReply.DataSendSuccessStatus)
      .send({
        task,
      });
  } catch (error) {
    if (error instanceof ZodError) {
      logger.error(error.message);

      reply
        .status(ErrorReply.ValidationErrorStatus)
        .send(ErrorReply.ValidationErrorMessage);
    }

    if (error instanceof Error) {
      logger.error(error.message);

      reply
        .status(ErrorReply.BaseErrorStatus)
        .send(error.message);
    }
  };
};

export const GetTasksController = async (
  req: FastifyRequest<{ Querystring: IGetTasks }>,
  reply: FastifyReply,
) => {
  try {
    const data = GetTasksSchema.parse(req.query);

    const tasks = await prisma.task.findMany({
      where: {
        type: data.type,
      },
    });

    reply
      .status(SuccessReply.DataSendSuccessStatus)
      .send({
        tasks,
      });
  } catch (error) {
    if (error instanceof ZodError) {
      logger.error(error.message);

      reply
        .status(ErrorReply.ValidationErrorStatus)
        .send(ErrorReply.ValidationErrorMessage);
    }

    if (error instanceof Error) {
      logger.error(error.message);

      reply
        .status(ErrorReply.BaseErrorStatus)
        .send(error.message);
    }
  };
};

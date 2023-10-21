import { FastifyRequest, FastifyReply } from 'fastify';
import { ZodError } from 'zod';

import prisma from '../../prisma';

import { verifyAccessToken } from '../../integrations/jwt';
import { logger } from '../../log';

import { SuccessReply } from '../../reply/success.reply';
import { ErrorReply } from '../../reply/error.reply';
import { CreateTaskSchema } from './validator';
import { ICreateTask } from './interface';

export const UpdateUserController = async (
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
        question: data.question,
        type: data.type,
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

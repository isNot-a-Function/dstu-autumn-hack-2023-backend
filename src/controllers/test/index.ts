import { FastifyReply, FastifyRequest } from 'fastify';
import { ZodError } from 'zod';

import { logger } from '../../log';
import prisma from '../../prisma';

import { SuccessReply } from '../../reply/success.reply';
import { ErrorReply } from '../../reply/error.reply';

import { verifyAccessToken } from '../../integrations/jwt';
import { ICreateTest } from './interface';
import { CreateTestSchema, GetTestSchema } from './validator';

export const CreateTestController = async (
  req: FastifyRequest<{ Body: ICreateTest }>,
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

    const data = CreateTestSchema.parse(req.body);

    const newGroup = await prisma.test.create({
      data: {
        tasks: {
          connect:
            data.tasks.map((task) => ({ id: task })),
        },
        title: data.title,
      },
    });

    reply
      .status(SuccessReply.DataSendSuccessStatus)
      .send({
        group: newGroup,
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

export const GetTestController = async (
  req: FastifyRequest<{ Params: ICreateTest }>,
  reply: FastifyReply,
) => {
  try {
    const data = GetTestSchema.parse(req.params);

    const test = await prisma.test.findUnique({
      select: {
        createdAt: true,
        id: true,
        tasks: {
          select: {
            id: true,
            question: true,
            type: true,
            variants: true,
          },
        },
        title: true,
      },
      where: {
        id: Number(data.testId),
      },
    });

    reply
      .status(SuccessReply.DataSendSuccessStatus)
      .send({
        test,
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

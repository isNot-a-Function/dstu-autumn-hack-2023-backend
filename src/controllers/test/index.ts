import { FastifyReply, FastifyRequest } from 'fastify';
import { ZodError } from 'zod';

import { logger } from '../../log';
import prisma from '../../prisma';

import { SuccessReply } from '../../reply/success.reply';
import { ErrorReply } from '../../reply/error.reply';

import { verifyAccessToken } from '../../integrations/jwt';
import { ICreateTest } from './interface';
import { CreateTestSchema } from './validator';

export const StartChatingController = async (
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

    // const newGroup = await prisma.test.create({
    //   data: {
    //     title: data.title,
    //     tasks: {
    //       connect: {
    //         id:
    //       }
    //     }
    //   },
    // });

    reply
      .status(SuccessReply.DataSendSuccessStatus)
      .send({
        // group: newGroup,
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

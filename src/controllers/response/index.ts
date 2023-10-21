import { FastifyRequest, FastifyReply } from 'fastify';
import { ZodError } from 'zod';

import { logger } from '../../log';
import prisma from '../../prisma';
import { ErrorReply } from '../../reply/error.reply';
import { SuccessReply } from '../../reply/success.reply';
import { verifyAccessToken } from '../../integrations/jwt';
import { IGetResponses, IUserResponse, IVerdictResponse } from './interface';
import { GetResponsesSchema, UserResponseSchema, VerdictResponseSchema } from './validator';

export const GetResponsesController = async (
  req: FastifyRequest<{ Querystring: IGetResponses }>,
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

    const data = GetResponsesSchema.parse(req.query);

    const responses = await prisma.response.findMany({
      where: {
        direction: {
          specialization: data.specialization
            ? {
              title: data.specialization,
            }
            : undefined,
          type: data.type,
        },
      },

    });

    reply
      .status(SuccessReply.DataSendSuccessStatus)
      .send({
        responses,
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

export const VerdictResponseController = async (
  req: FastifyRequest<{ Body: IVerdictResponse }>,
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

    const data = VerdictResponseSchema.parse(req.body);

    const response = await prisma.response.update({
      data: {
        verdict: data.verdict,
      },
      where: {
        id: data.responseId,
      },
    });

    reply
      .status(SuccessReply.DataSendSuccessStatus)
      .send({
        response,
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

export const UserResponseController = async (
  req: FastifyRequest<{ Querystring: IUserResponse }>,
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

    const data = UserResponseSchema.parse(req.query);

    const response = await prisma.response.create({
      data: {
        direction: {
          connect: {
            id: Number(data.directionId),
          },
        },
        user: {
          connect: {
            id: user.userId,
          },
        },
      },
    });

    reply
      .status(SuccessReply.DataSendSuccessStatus)
      .send({
        message: 'Вы записаны',
        response,
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

import { FastifyReply, FastifyRequest } from 'fastify';
import { ZodError } from 'zod';

import { logger } from '../../log';
import prisma from '../../prisma';

import { SuccessReply } from '../../reply/success.reply';
import { ErrorReply } from '../../reply/error.reply';

import { verifyAccessToken } from '../../integrations/jwt';
import { IGetDirectionsBySpecialization, IGetOneDirection } from './interface';
import { GetDirectionsBySpecializationSchema, GetOneDirectionSchema } from './validator';

export const GetDirectionsBySpecializationController = async (
  req: FastifyRequest<{ Querystring: IGetDirectionsBySpecialization }>,
  reply: FastifyReply,
) => {
  try {
    const data = GetDirectionsBySpecializationSchema.parse(req.query);

    const directions = await prisma.direction.findMany({
      include: {
        specialization: true,
      },
      where: {
        specialization: data.specialization
          ? {
            title: data.specialization,
          }
          : undefined,
        type: data.type,
      },

    });

    reply
      .status(SuccessReply.DataSendSuccessStatus)
      .send({
        directions,
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

export const GetOneDirectionController = async (
  req: FastifyRequest<{ Params: IGetOneDirection }>,
  reply: FastifyReply,
) => {
  try {
    const data = GetOneDirectionSchema.parse(req.params);

    const direction = await prisma.direction.findUnique({
      include: {
        specialization: true,
      },
      where: {
        id: Number(data.directionId),
      },
    });

    reply
      .status(SuccessReply.DataSendSuccessStatus)
      .send({
        direction,
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

export const GetMyDirectionsController = async (
  req: FastifyRequest,
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

    const data = await prisma.user.findUnique({
      select: {
        responses: {
          include: {
            answers: true,
            tests: true,
          },
        },
      },
      where: {
        id: Number(user.userId),
      },
    });

    reply
      .status(SuccessReply.DataSendSuccessStatus)
      .send({
        user: data,
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

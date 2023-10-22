import { FastifyRequest, FastifyReply } from 'fastify';
import { ZodError } from 'zod';

import prisma from '../../prisma';

import { verifyAccessToken } from '../../integrations/jwt';
import { logger } from '../../log';

import { SuccessReply } from '../../reply/success.reply';
import { ErrorReply } from '../../reply/error.reply';
import { IGetUser, IUpdateUser } from './interface';
import { GetUserSchema, UpdateUserSchema } from './validation';

export const UpdateUserController = async (
  req: FastifyRequest<{ Body: IUpdateUser }>,
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

    const data = UpdateUserSchema.parse(req.body);

    const updatedUser = await prisma.user.update({
      data: {
        fullname: data.fullname,
        logo: data.logo,
        phone: data.phone,
        tgLink: data.tgLink,
        vkLink: data.vkLink,
      },
      where: {
        id: user.userId,
      },
    });

    reply
      .status(SuccessReply.DataSendSuccessStatus)
      .send({
        user: updatedUser,
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

export const GetMeController = async (
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
      include: {
        answers: {
          include: {
            answerModel: {
              include: {
                taskAnswers: {
                  include: {
                    task: true,
                  },
                },
              },
            },
          },
        },
        responses: {
          include: {
            direction: true,
          },
        },
      },
      where: {
        id: user.userId,
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

export const GetUserController = async (
  req: FastifyRequest<{ Params: IGetUser }>,
  reply: FastifyReply,
) => {
  try {
    const data = GetUserSchema.parse(req.params);

    const user = await prisma.user.findUnique({
      include: {
        responses: {
          include: {
            tests: {
              include: {
                answers: {
                  include: {
                    taskAnswers: {
                      include: {
                        task: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      where: {
        id: Number(data.userId),
      },
    });

    reply
      .status(SuccessReply.DataSendSuccessStatus)
      .send({
        user,
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

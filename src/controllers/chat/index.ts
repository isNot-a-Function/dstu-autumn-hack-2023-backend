import { FastifyReply, FastifyRequest } from 'fastify';
import { ZodError } from 'zod';

import { logger } from '../../log';
import prisma from '../../prisma';

import { SuccessReply } from '../../reply/success.reply';
import { ErrorReply } from '../../reply/error.reply';

import { verifyAccessToken } from '../../integrations/jwt';
import { IGetMessagesInGroup, ISendMessage } from './interface';
import {
  GetMessagesInGroupSchema,
  SendMessageSchema,
  StartChatingSchema,
} from './validator';

export const StartChatingController = async (
  req: FastifyRequest<{ Body: ISendMessage }>,
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

    const data = StartChatingSchema.parse(req.body);

    const newGroup = await prisma.messagerGroup.create({
      data: {
        creatorId: user.userId,
        users: {
          connect: [{ id: user.userId }, { id: data.userId }],
        },
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

export const SendMessageController = async (
  req: FastifyRequest<{ Body: ISendMessage }>,
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

    const data = SendMessageSchema.parse(req.body);

    const newMessage = await prisma.message.create({
      data: {
        group: {
          connect: {
            id: data.groupId,
          },
        },
        sender: {
          connect: {
            id: user.userId,
          },
        },
        text: data.text,
      },
    });

    reply
      .status(SuccessReply.DataSendSuccessStatus)
      .send({
        message: newMessage,
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

export const GetMyGroupsController = async (
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

    const groups = await prisma.messagerGroup.findMany({
      where: {
        users: {
          some: {
            id: user.userId,
          },
        },
      },
    });

    reply
      .status(SuccessReply.DataSendSuccessStatus)
      .send({
        groups,
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

export const GetMessagesInGroupController = async (
  req: FastifyRequest<{ Params: IGetMessagesInGroup }>,
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

    const data = GetMessagesInGroupSchema.parse(req.params);

    const messages = await prisma.message.findMany({
      where: {
        groupId: Number(data.groupId),
      },
    });

    reply
      .status(SuccessReply.DataSendSuccessStatus)
      .send({
        messages,
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

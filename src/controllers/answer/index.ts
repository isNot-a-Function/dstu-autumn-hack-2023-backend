import { ZodError } from 'zod';
import { FastifyRequest, FastifyReply } from 'fastify';

import prisma from '../../prisma';

import { SuccessReply } from '../../reply/success.reply';
import { ErrorReply } from '../../reply/error.reply';

import { logger } from '../../log';
import { verifyAccessToken } from '../../integrations/jwt';
import { TestAnswers } from '../../utils/test';
import { ISendAnswer } from './interface';
import { SendAnswerSchema } from './validator';

export const SendAnswerController = async (
  req: FastifyRequest<{ Body: ISendAnswer }>,
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

    const data = SendAnswerSchema.parse(req.query);

    const test = await prisma.test.findUnique({
      select: {
        tasks: true,
      },
      where: {
        id: data.testId,
      },
    });

    const response = await prisma.response.findFirst({
      where: {
        direction: {
          id: data.directionId,
        },
        userId: user.userId,
      },
    });

    const taskAnswers: {
      answer: string;
      taskId: number;
      userId: any;
  }[] = await data.answers.map((task, index) => {
    return {
      answer: task.toString(),
      taskId: test!.tasks[index + 1].id,
      userId: user.userId,
    };
  });

    const answer = await prisma.answer.create({
      data: {
        response: {
          connect: {
            id: response?.id,
          },
        },
        taskAnswers: {
          createMany: {
            data: taskAnswers,
          },
        },
        test: {
          connect: {
            id: data.testId,
          },
        },
      },
      include: {
        taskAnswers: true,
        test: {
          include: {
            tasks: true,
          },
        },
      },
    });

    // Вызов ф-ции проверки
    TestAnswers(answer);

    reply
      .status(SuccessReply.DataSendSuccessStatus)
      .send({
        message: 'Ваши ответы отправленны, результат вы можете посмотреть через некоторое время в профиле',
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

import { ZodError } from 'zod';
import { FastifyRequest, FastifyReply } from 'fastify';

import prisma from '../../prisma';

import { SuccessReply } from '../../reply/success.reply';
import { ErrorReply } from '../../reply/error.reply';

import { logger } from '../../log';
import { ISendAnswer } from './interface';
import { SendAnswerSchema } from './validator';

export const GetDirectionsBySpecializationController = async (
  req: FastifyRequest<{ Body: ISendAnswer }>,
  reply: FastifyReply,
) => {
  try {
    const data = SendAnswerSchema.parse(req.query);

    // const directions = await prisma.answer.create({
    //   data:

    // });

    // reply
    //   .status(SuccessReply.DataSendSuccessStatus)
    //   .send({
    //     directions,
    //   });
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

// export const GetOneDirectionController = async (
//   req: FastifyRequest<{ Params: IGetOneDirection }>,
//   reply: FastifyReply,
// ) => {
//   try {
//     const data = GetOneDirectionSchema.parse(req.params);

//     const direction = await prisma.direction.findUnique({
//       include: {
//         specialization: true,
//       },
//       where: {
//         id: Number(data.directionId),
//       },
//     });

//     reply
//       .status(SuccessReply.DataSendSuccessStatus)
//       .send({
//         direction,
//       });
//   } catch (error) {
//     if (error instanceof ZodError) {
//       logger.error(error.message);

//       reply
//         .status(ErrorReply.ValidationErrorStatus)
//         .send(ErrorReply.ValidationErrorMessage);
//     }

//     if (error instanceof Error) {
//       logger.error(error.message);

//       reply
//         .status(ErrorReply.BaseErrorStatus)
//         .send(error.message);
//     }
//   };
// };
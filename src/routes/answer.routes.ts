import { FastifyInstance } from 'fastify';

import { SendAnswerController } from '../controllers/answer';

export const answerRouter = (fastify: FastifyInstance, opts: any, next: (err?: Error) => void) => {
  fastify.post('/', SendAnswerController);

  next();
};

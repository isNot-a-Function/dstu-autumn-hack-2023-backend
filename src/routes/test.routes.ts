import { FastifyInstance } from 'fastify';

import { CreateTestController, GetTestController } from '../controllers/test';

export const testRouter = (fastify: FastifyInstance, opts: any, next: (err?: Error) => void) => {
  fastify.post('/', CreateTestController);

  fastify.get('/:testId', GetTestController);

  next();
};

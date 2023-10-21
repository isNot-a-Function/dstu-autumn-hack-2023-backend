import { FastifyInstance } from 'fastify';

import { CreateTaskController } from '../controllers/task';

export const taskRouter = (fastify: FastifyInstance, opts: any, next: (err?: Error) => void) => {
  fastify.post('/', CreateTaskController);

  next();
};

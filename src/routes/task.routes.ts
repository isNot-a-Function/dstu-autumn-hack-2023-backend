import { FastifyInstance } from 'fastify';

import { CreateTaskController, GetTasksController } from '../controllers/task';

export const taskRouter = (fastify: FastifyInstance, opts: any, next: (err?: Error) => void) => {
  fastify.post('/', CreateTaskController);

  fastify.get('/', GetTasksController);

  next();
};

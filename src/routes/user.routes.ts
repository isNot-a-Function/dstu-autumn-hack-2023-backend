import { FastifyInstance } from 'fastify';

import { UpdateUserController } from '../controllers/user';

export const userRouter = (fastify: FastifyInstance, opts: any, next: (err?: Error) => void) => {
  fastify.put('/', UpdateUserController);

  next();
};

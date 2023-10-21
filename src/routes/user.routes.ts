import { FastifyInstance } from 'fastify';

import { GetMeController, GetUserController, UpdateUserController } from '../controllers/user';

export const userRouter = (fastify: FastifyInstance, opts: any, next: (err?: Error) => void) => {
  fastify.put('/', UpdateUserController);

  fastify.get('/:userId', GetUserController);

  fastify.get('/me', GetMeController);

  next();
};

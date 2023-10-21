import { UpdateUserController } from 'controllers/user';
import { FastifyInstance } from 'fastify';

export const userRouter = (fastify: FastifyInstance, opts: any, next: (err?: Error) => void) => {
  fastify.put('/', UpdateUserController);

  next();
};

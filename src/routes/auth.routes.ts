import { FastifyInstance } from 'fastify';

import {
  SignInUserController,
  SignUpUserController,
  RefreshTokenController,
} from '../controllers/auth';

export const authRouter = (fastify: FastifyInstance, opts: any, next: (err?: Error) => void) => {
  fastify.post('/signup', SignUpUserController);

  fastify.post('/signin', SignInUserController);

  fastify.get('/refresh', RefreshTokenController);

  next();
};

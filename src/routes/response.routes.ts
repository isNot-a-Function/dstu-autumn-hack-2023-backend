import { FastifyInstance } from 'fastify';

import { GetResponsesController, UserResponseController, VerdictResponseController } from '../controllers/response';

export const responseRouter = (fastify: FastifyInstance, opts: any, next: (err?: Error) => void) => {
  fastify.get('/', GetResponsesController);

  fastify.post('/verdict', VerdictResponseController);

  fastify.get('/send', UserResponseController);

  next();
};

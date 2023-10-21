import { FastifyInstance } from 'fastify';

import { UploadFileController } from '../controllers/file';

export const fileRouter = (fastify: FastifyInstance, opts: any, next: (err?: Error) => void) => {
  fastify.post('/upload', UploadFileController);

  next();
};

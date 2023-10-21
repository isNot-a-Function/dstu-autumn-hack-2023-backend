import { FastifyInstance } from 'fastify';
import {
  GetDirectionsBySpecializationController,
  GetOneDirectionController,
  GetMyDirectionsController,
} from '../controllers/direction';

export const chatRouter = (fastify: FastifyInstance, opts: any, next: (err?: Error) => void) => {
  fastify.get('/', GetDirectionsBySpecializationController);

  fastify.get('/:directionId', GetOneDirectionController);

  fastify.get('/my', GetMyDirectionsController);

  next();
};

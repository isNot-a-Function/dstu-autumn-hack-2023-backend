import { FastifyInstance } from 'fastify';

import {
  GetMessagesInGroupController,
  GetMyGroupsController,
  SendMessageController,
  StartChatingController,
} from '../controllers/chat';

export const chatRouter = (fastify: FastifyInstance, opts: any, next: (err?: Error) => void) => {
  fastify.post('/start', StartChatingController);

  fastify.post('/send', SendMessageController);

  fastify.get('/groups', GetMyGroupsController);

  fastify.get('/:groupId', GetMessagesInGroupController);

  next();
};

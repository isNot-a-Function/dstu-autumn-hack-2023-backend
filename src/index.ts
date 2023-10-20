import { logger } from './log';
import { startServer } from './server';

try {
  startServer();
} catch (error) {
  error instanceof Error && logger.error(error.message);
}

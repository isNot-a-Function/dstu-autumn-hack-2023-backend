import path from 'path';
import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

import { SERVICE_NAME } from '../config';
import { winstonConfiguration } from '../configuration';

const { align, colorize, combine, printf, timestamp } = winston.format;

export const logger = winston.createLogger({
  defaultMeta: {
    service: SERVICE_NAME,
  },
  format: combine(
    timestamp({
      format: winstonConfiguration.timestampFormat,
    }),
    printf((info) => `[${info.timestamp}] [${info.level.toUpperCase()}]:   ${info.message}`),
  ),
  transports: [
    new DailyRotateFile({
      datePattern: winstonConfiguration.datePattern,
      filename: path.join(__dirname, 'logs', 'error-%DATE%.log'),
      level: 'error',
      maxFiles: winstonConfiguration.maxFiles,
      zippedArchive: true,
    }),
    new DailyRotateFile({
      datePattern: winstonConfiguration.datePattern,
      filename: path.join(__dirname, 'logs', 'warn-%DATE%.log'),
      level: 'warn',
      maxFiles: winstonConfiguration.maxFiles,
      zippedArchive: true,
    }),
    new DailyRotateFile({
      datePattern: winstonConfiguration.datePattern,
      filename: path.join(__dirname, 'logs', 'info-%DATE%.log'),
      level: 'info',
      maxFiles: winstonConfiguration.maxFiles,
      zippedArchive: true,
    }),

    new winston.transports.Console({
      format: combine(
        timestamp(),
        colorize({ all: true }),
        align(),
      ),
    }),
  ],
});

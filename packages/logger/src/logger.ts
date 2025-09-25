import pino, { Logger, LoggerOptions } from 'pino';

type CreateLoggerOptions = LoggerOptions & {
  name?: string;
};

export const createLogger = (options: CreateLoggerOptions = {}): Logger =>
  pino({
    level: process.env.LOG_LEVEL ?? 'info',
    ...options,
  });

export const logger = createLogger({ name: 'cac' });

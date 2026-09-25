import { env, LOG_LEVELS, type LogLevel } from '../config';

type WritableLevel = Exclude<LogLevel, 'silent'>;

/**
 * Writes one log line if its level reaches the configured LOG_LEVEL.
 * The line carries the time, the level and the context; the details (an
 * error, an object) are passed as is, so that an error keeps its stack trace.
 * Warnings and errors go to stderr, the rest to stdout.
 * This is the only place of the application allowed to call console.
 * @param level - The level of the line
 * @param context - Where the line comes from, e.g. 'SSE'
 * @param message - What happened
 * @param details - Optional error or data attached to the line
 */
const write = (
  level: WritableLevel,
  context: string,
  message: string,
  details: unknown[]
): void => {
  if (LOG_LEVELS.indexOf(level) < LOG_LEVELS.indexOf(env.logLevel)) return;
  const line = `${new Date().toISOString()} ${level.toUpperCase()} [${context}] ${message}`;
  const output =
    level === 'error' || level === 'warn' ? console.error : console.log;
  output(line, ...details);
};

/**
 * Creates a logger bound to a context, the single entry point for logging in
 * the application code.
 * @param context - Where the lines come from, e.g. 'SSE', 'HTTP'
 * @example
 * const log = createLogger('SSE');
 * log.error('Broadcast skipped', error);
 */
export const createLogger = (context: string) => ({
  debug: (message: string, ...details: unknown[]) =>
    write('debug', context, message, details),
  info: (message: string, ...details: unknown[]) =>
    write('info', context, message, details),
  warn: (message: string, ...details: unknown[]) =>
    write('warn', context, message, details),
  error: (message: string, ...details: unknown[]) =>
    write('error', context, message, details),
});

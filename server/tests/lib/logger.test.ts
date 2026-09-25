import { jest } from '@jest/globals';
import { env, type LogLevel } from '../../config';
import { createLogger } from '../../lib/logger';

describe('logger', () => {
  const originalLevel = env.logLevel;
  let consoleLog: jest.SpiedFunction<typeof console.log>;
  let consoleError: jest.SpiedFunction<typeof console.error>;

  /** Changes the configured level for one test; restored in afterEach. */
  const setLevel = (level: LogLevel) => {
    (env as { logLevel: LogLevel }).logLevel = level;
  };

  beforeEach(() => {
    consoleLog = jest.spyOn(console, 'log').mockImplementation(() => {});
    consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    setLevel(originalLevel);
    jest.restoreAllMocks();
  });

  it('writes the time, the level, the context and the message', () => {
    setLevel('debug');

    createLogger('SSE').info('Client connected');

    expect(consoleLog).toHaveBeenCalledWith(
      expect.stringMatching(
        /^\d{4}-\d{2}-\d{2}T\S+Z INFO \[SSE\] Client connected$/
      )
    );
  });

  it('passes the details as is, so that an error keeps its stack trace', () => {
    const error = new Error('boom');

    createLogger('HTTP').error('GET /teams', error);

    expect(consoleError).toHaveBeenCalledWith(
      expect.stringContaining('ERROR [HTTP] GET /teams'),
      error
    );
  });

  it('sends warnings and errors to stderr, the rest to stdout', () => {
    setLevel('debug');
    const log = createLogger('Test');

    log.debug('d');
    log.info('i');
    log.warn('w');
    log.error('e');

    expect(consoleLog).toHaveBeenCalledTimes(2);
    expect(consoleError).toHaveBeenCalledTimes(2);
  });

  it('skips the lines below the configured level', () => {
    setLevel('warn');
    const log = createLogger('Test');

    log.debug('d');
    log.info('i');
    log.warn('w');

    expect(consoleLog).not.toHaveBeenCalled();
    expect(consoleError).toHaveBeenCalledTimes(1);
  });

  it('writes nothing at the silent level', () => {
    setLevel('silent');

    createLogger('Test').error('e');

    expect(consoleError).not.toHaveBeenCalled();
  });
});

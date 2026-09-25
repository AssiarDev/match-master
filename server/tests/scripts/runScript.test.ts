import { jest } from '@jest/globals';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import prisma from '../../lib/prisma';
import { isEntryPoint, runScript } from '../../scripts/runScript';

const scriptPath = path.resolve('insert-db', 'someScript.ts');
const scriptUrl = pathToFileURL(scriptPath).href;

describe('runScript', () => {
  const originalArgv = process.argv;

  beforeEach(() => {
    jest.spyOn(prisma, '$disconnect').mockResolvedValue();
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    process.argv = originalArgv;
    process.exitCode = undefined;
    jest.restoreAllMocks();
  });

  /** Simulates `tsx <file>` on the command line. */
  const runFromCommandLine = (file: string) => {
    process.argv = ['node', file];
  };

  describe('isEntryPoint', () => {
    it('is true for the file run from the command line', () => {
      runFromCommandLine(scriptPath);

      expect(isEntryPoint(scriptUrl)).toBe(true);
    });

    it('is false for a module that is only imported', () => {
      runFromCommandLine(path.resolve('insert-db', 'importAll.ts'));

      expect(isEntryPoint(scriptUrl)).toBe(false);
    });
  });

  it('does not run main when the module is only imported', async () => {
    runFromCommandLine(path.resolve('insert-db', 'importAll.ts'));
    const main = jest.fn(async () => {});

    await runScript(scriptUrl, main);

    expect(main).not.toHaveBeenCalled();
    expect(prisma.$disconnect).not.toHaveBeenCalled();
  });

  it('runs main and closes Prisma when run from the command line', async () => {
    runFromCommandLine(scriptPath);
    const main = jest.fn(async () => {});

    await runScript(scriptUrl, main);

    expect(main).toHaveBeenCalledTimes(1);
    expect(prisma.$disconnect).toHaveBeenCalledTimes(1);
    expect(process.exitCode).toBeUndefined();
  });

  it('logs the error, sets exit code 1 and still closes Prisma when main fails', async () => {
    runFromCommandLine(scriptPath);
    const error = new Error('boom');

    await runScript(scriptUrl, async () => {
      throw error;
    });

    expect(console.error).toHaveBeenCalledWith(error);
    expect(process.exitCode).toBe(1);
    expect(prisma.$disconnect).toHaveBeenCalledTimes(1);
  });
});

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import prisma from '../lib/prisma';

/**
 * Resolves a path for comparison. Windows paths are case-insensitive, and
 * the drive letter may differ in case between `import.meta.url` and argv.
 * @param filePath - The path to normalize
 */
const normalize = (filePath: string): string => {
  const resolved = path.resolve(filePath);
  return process.platform === 'win32' ? resolved.toLowerCase() : resolved;
};

/**
 * Tells whether a module is the file run from the command line
 * (e.g. `tsx insert-db/insertLeagues.ts`), as opposed to being imported.
 * @param moduleUrl - The module's `import.meta.url`
 */
export const isEntryPoint = (moduleUrl: string): boolean =>
  process.argv[1] !== undefined &&
  normalize(fileURLToPath(moduleUrl)) === normalize(process.argv[1]);

/**
 * Runs a script's main function, only when its file is run directly, so that
 * importing the module (from importAll, a test or a future cron) never
 * triggers it.
 * Any error is logged with its stack trace and sets a non-zero exit code.
 * The Prisma connection is closed here, whatever the outcome, and never by
 * the import functions themselves: a caller running them inside the server
 * process must keep the shared connection open.
 * @param moduleUrl - The script's `import.meta.url`
 * @param main - The script's main function
 */
export const runScript = async (
  moduleUrl: string,
  main: () => Promise<void>
): Promise<void> => {
  if (!isEntryPoint(moduleUrl)) return;
  try {
    await main();
  } catch (error) {
    console.error(error);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
};

import prisma from '../lib/prisma';

/**
 * Waits between two SportMonks calls made by an import script.
 * 1.2 s keeps a script under 3000 calls per hour, SportMonks' default limit
 * per entity. Only the scripts are throttled, not the application's requests.
 */
export const pauseBetweenApiCalls = (): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, 1200));

/**
 * Loads the leagues already in the database, which every step after
 * insertLeagues iterates over.
 * @returns The leagues, never empty
 * @throws If there is none: the steps were run out of order
 */
export const findImportedLeagues = async () => {
  const leagues = await prisma.competitions.findMany();
  if (leagues.length === 0)
    throw new Error(
      'No league in the database: run insert-db/insertLeagues.ts first, or insert-db/importAll.ts for the whole import.'
    );
  return leagues;
};

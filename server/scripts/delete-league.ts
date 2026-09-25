import prisma from '../lib/prisma';
import { runScript } from './runScript';

/**
 * Reads the league ID given on the command line.
 * @param args - The command line arguments after the script path
 * @returns The league ID, a strictly positive integer
 * @throws With the usage, if the argument is missing or invalid
 */
export const parseLeagueId = (args: string[]): number => {
  const leagueId = Number(args[0]);
  if (!Number.isInteger(leagueId) || leagueId <= 0)
    throw new Error(
      'Usage: tsx scripts/delete-league.ts <leagueId> (a strictly positive integer)'
    );
  return leagueId;
};

/**
 * Deletes a league with its favorites and its team links, in one transaction.
 * @param leagueId - The ID of the league to delete
 * @throws If the league does not exist, or the transaction fails
 */
export const deleteLeague = async (leagueId: number): Promise<void> => {
  await prisma.$transaction([
    prisma.userFavorite.deleteMany({
      where: { competition_id: leagueId },
    }),
    prisma.teamCompetition.deleteMany({
      where: { competition_id: leagueId },
    }),
    prisma.competitions.delete({
      where: { id: leagueId },
    }),
  ]);
  console.log(`League ${leagueId} deleted`);
};

runScript(import.meta.url, () =>
  deleteLeague(parseLeagueId(process.argv.slice(2)))
);

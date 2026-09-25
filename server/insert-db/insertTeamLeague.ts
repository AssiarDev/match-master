import prisma from '../lib/prisma';
import { teamService } from '../lib/container';
import { runScript } from '../scripts/runScript';
import { findImportedLeagues, pauseBetweenApiCalls } from './importHelpers';

/**
 * Links every league already in the database to the teams of its current
 * season, replacing the previous links so that relegated teams are detached.
 * A failing league does not stop the others; the failures are counted and
 * reported at the end.
 * @throws If there is no league in the database, or if at least one league
 * could not be linked
 */
export const insertTeamLeague = async (): Promise<void> => {
  const leagues = await findImportedLeagues();
  let failures = 0;
  for (const league of leagues) {
    try {
      const teamsResult = await teamService.teamsForLeague(league.id);
      await pauseBetweenApiCalls();
      if (!teamsResult.success) continue;
      const teams = teamsResult.result.teams;
      if (teams.length === 0) {
        console.warn(
          `League ${league.id} : aucune équipe renvoyée, liens conservés`
        );
        continue;
      }
      await prisma.$transaction([
        prisma.teamCompetition.deleteMany({
          where: { competition_id: league.id },
        }),
        prisma.teamCompetition.createMany({
          data: teams.map((team) => ({
            team_id: team.id,
            competition_id: league.id,
          })),
          skipDuplicates: true,
        }),
      ]);
      console.log(`League ${league.id} : ${teams.length} équipes liées`);
    } catch (error) {
      failures++;
      console.error(`League ${league.id} : liaison impossible`, error);
    }
  }
  if (failures > 0)
    throw new Error(`${failures} league(s) could not be linked to their teams`);
};

runScript(import.meta.url, insertTeamLeague);

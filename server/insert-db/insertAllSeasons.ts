import prisma from '../lib/prisma';
import { LeagueApiRepository } from '../repositories/leagueApi.repository';
import { runScript } from '../scripts/runScript';
import { findImportedLeagues, pauseBetweenApiCalls } from './importHelpers';
const leagueApiRepo = new LeagueApiRepository();

/**
 * Imports or updates every season of the leagues already in the database.
 * @throws If there is no league in the database
 */
export const insertAllSeasons = async (): Promise<void> => {
  const leagues = await findImportedLeagues();
  for (const league of leagues) {
    const leagueData = await leagueApiRepo.fetchLeagueWithSeasons(league.id);
    await pauseBetweenApiCalls();
    const seasons = leagueData.data?.seasons ?? [];
    if (seasons.length === 0) {
      console.warn('No season found for the league :', league.id);
    }
    for (const season of seasons) {
      const data = {
        sport_id: season.sport_id,
        league_id: season.league_id,
        tie_breaker_rule_id: season.tie_breaker_rule_id,
        name: season.name,
        finished: season.finished,
        pending: season.pending,
        is_current: season.is_current,
        starting_at: season.starting_at ? new Date(season.starting_at) : null,
        ending_at: season.ending_at ? new Date(season.ending_at) : null,
        games_in_current_week: season.games_in_current_week,
      };
      await prisma.season.upsert({
        where: { id: season.id },
        update: data,
        create: { id: season.id, ...data },
      });
      console.log(`seasons ${season.name} (ID ${season.id}) upserted`);
    }
  }
  console.log('All seasons insert !');
};

runScript(import.meta.url, insertAllSeasons);

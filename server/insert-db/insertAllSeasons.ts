import { PrismaClient } from '@prisma/client';
import { LeagueApiRepository } from '../repositories/leagueApi.repository';
import type { ApiResponse, ApiLeague } from '../types/api';

const prisma: PrismaClient = new PrismaClient();
const leagueApiRepo = new LeagueApiRepository();

export const insertAllSeasons = async (): Promise<void> => {
  const leagues = await prisma.competitions.findMany();
  if (leagues.length === 0) {
    console.error('No leagues found in database');
    return;
  }
  for (const league of leagues) {
    const leagueData: ApiResponse<ApiLeague> =
      await leagueApiRepo.fetchLeagueWithSeasons(league.id);
    const seasons = leagueData.data?.seasons ?? [];
    if (seasons.length === 0) {
      console.error('No season found for the league :', league.id);
    }
    for (const season of seasons) {
      await prisma.season.create({
        data: {
          id: season.id,
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
        },
      });
      console.log(`seasons ${season.name} (ID ${season.id}) insert`);
    }
  }
  console.log('All seasons insert !');
  await prisma.$disconnect();
};

insertAllSeasons();

import { PrismaClient } from '@prisma/client';
import { LeagueApiRepository } from '../repositories/leagueApi.repository.js';
import { SeasonRepository } from '../repositories/season.repository.js';

const prisma = new PrismaClient();
const leagueApiRepo = new LeagueApiRepository()
const seasonRepo = new SeasonRepository()

export const insertTeamsFromSeasons = async () => {
  try {
    const leagues = await prisma.competitions.findMany();

    for (const league of leagues) {
      const leagueData = await leagueApiRepo.fetchLeagueWithSeasons(league.id);
      const seasons = leagueData.data?.seasons ?? [];

      const validSeasons = seasons.filter((s) => s.id > 20000);

      for (const season of validSeasons) {
        const teamsData = await seasonRepo.fetchSeasonsTeams(season.id);
        const teams = teamsData.data?.teams ?? [];

        if (!teams.length) {
          console.warn(`No teams found for season ${season.id}`);
          continue;
        }

        const formattedTeams = teams.map((t) => ({
          id: t.id,
          country_id: t.country_id ?? null,
          venue_id: t.venue_id ?? null,
          gender: t.gender ?? null,
          name: t.name,
          short_code: t.short_code ?? null,
          image_path: t.image_path ?? null,
          founded: t.founded ?? null,
          type: t.type ?? null,
          placeholder: t.placeholder ?? false,
          last_played_at: t.last_played_at ? new Date(t.last_played_at) : null,
        }));

        await prisma.team.createMany({
          data: formattedTeams,
          skipDuplicates: true,
        });

        console.log(
          `${formattedTeams.length} teams inserted for season ${season.id}`
        );
      }
    }

    console.log('Teams successfully inserted from seasons');
  } catch (error) {
    console.error('Team insertion error :', error.message);
  } finally {
    await prisma.$disconnect();
  }
};

insertTeamsFromSeasons();

import { PrismaClient } from '@prisma/client';
import { TeamApiRepository } from '../repositories/teamApi.repository.js';
import { LeagueApiRepository } from '../repositories/leagueApi.repository.js';
import { SeasonRepository } from '../repositories/season.repository.js';

const prisma = new PrismaClient();
const teamApiRepo = new TeamApiRepository()
const leagueApiRepo = new LeagueApiRepository()
const seasonRepo = new SeasonRepository()

export const insertAllSquads = async () => {
  const leagues = await prisma.competitions.findMany();

  if (leagues.length === 0) {
    console.error('No leagues found in database');
    return;
  }

  for (const league of leagues) {
    const leagueData = await leagueApiRepo.fetchLeagueWithSeasons(league.id);
    const seasons = leagueData.data?.seasons ?? [];

    if (seasons.length === 0) {
      console.warn('No seasons found for league :', league.id);
      continue;
    }

    const validSeasons = seasons.filter((s) => s.id > 20000);

    if (validSeasons.length === 0) {
      console.warn(`No valid seasons with squads for league ${league.id}`);
      continue;
    }

    for (const season of validSeasons) {
      const teamsData = await seasonRepo.fetchSeasonsTeams(season.id);
      const teams = teamsData.data?.teams ?? [];

      if (teams.length === 0) {
        console.warn('No teams found for season :', season.id);
        continue;
      }

      for (const team of teams) {
        const squads = await teamApiRepo.fetchTeamSquad(season.id, team.id);
        const squadList = squads.data ? squads.data : [];

        if (squadList.length === 0) {
          console.warn(
            `No squad found for team ${team.name} in season ${season.id}`
          );
        }

        for (const squad of squadList) {
          const player = squad.player;

          if (!player || !player.id) {
            console.warn(
              `Player ${squad.player_id} missing in API response, skipping.`
            );
            continue;
          }

          const teamExists = await prisma.team.findUnique({
            where: { id: squad.team_id },
          });

          if (!teamExists) {
            console.warn(
              `Skipping squad ${squad.id} because team ${squad.team_id} does not exist in DB`
            );
            continue;
          }

          await prisma.player.upsert({
            where: { id: player.id },
            update: {
              sport_id: player.sport_id,
              country_id: player.country_id,
              nationality_id: player.nationality_id,
              city_id: player.city_id,
              position_id: player.position_id,
              detailed_position_id: player.detailed_position_id,
              type_id: player.type_id,
              common_name: player.common_name,
              firstname: player.firstname,
              lastname: player.lastname,
              name: player.name,
              display_name: player.display_name,
              image_path: player.image_path,
              height: player.height,
              weight: player.weight,
              date_of_birth: player.date_of_birth
                ? new Date(player.date_of_birth)
                : null,
              gender: player.gender,
            },
            create: {
              id: player.id,
              sport_id: player.sport_id,
              country_id: player.country_id,
              nationality_id: player.nationality_id,
              city_id: player.city_id,
              position_id: player.position_id,
              detailed_position_id: player.detailed_position_id,
              type_id: player.type_id,
              common_name: player.common_name,
              firstname: player.firstname,
              lastname: player.lastname,
              name: player.name,
              display_name: player.display_name,
              image_path: player.image_path,
              height: player.height,
              weight: player.weight,
              date_of_birth: player.date_of_birth
                ? new Date(player.date_of_birth)
                : null,
              gender: player.gender,
            },
          });

          await prisma.squad.upsert({
            where: { id: squad.id },
            update: {
              player_id: squad.player_id,
              team_id: squad.team_id,
              season_id: season.id,
              position_id: squad.position_id,
              has_values: squad.has_values,
              jersey_number: squad.jersey_number,
            },
            create: {
              id: squad.id,
              player_id: squad.player_id,
              team_id: squad.team_id,
              season_id: season.id,
              position_id: squad.position_id,
              has_values: squad.has_values,
              jersey_number: squad.jersey_number,
            },
          });

          console.log(
            `Player ${squad.player_id} upserted for season ${season.id}`
          );
        }
      }
    }
  }
  console.log('Squad import completed');
  await prisma.$disconnect();
};

insertAllSquads();

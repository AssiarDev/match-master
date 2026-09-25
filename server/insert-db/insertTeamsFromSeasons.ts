import prisma from '../lib/prisma';
import { LeagueApiRepository } from '../repositories/leagueApi.repository';
import { SeasonRepository } from '../repositories/season.repository';
import { runScript } from '../scripts/runScript';
import type { ApiSeason, ApiTeam } from '../types/api';
import { findImportedLeagues, pauseBetweenApiCalls } from './importHelpers';
const leagueApiRepo = new LeagueApiRepository();
const seasonRepo = new SeasonRepository();

/**
 * Seasons whose SportMonks ID is at or below this value are skipped.
 * Its origin is not documented. It is not a date cutoff: SportMonks IDs do
 * not follow the calendar (2003/2004 is 24256, 2022/2023 is 19734), so the
 * filter keeps a mix of old and recent seasons. Kept as is so that the import
 * result does not change (open question, see ADR-15).
 */
const MIN_SEASON_ID = 20000;

/**
 * Imports or updates the teams of every kept season of the leagues already
 * in the database.
 * A team plays in many seasons, but its data does not depend on the season:
 * it is written only the first time it is met during the run (ADR-18).
 * @throws If there is no league in the database
 */
export const insertTeamsFromSeasons = async (): Promise<void> => {
  const leagues = await findImportedLeagues();
  const upsertedTeamIds = new Set<number>();
  for (const league of leagues) {
    const leagueData = await leagueApiRepo.fetchLeagueWithSeasons(league.id);
    await pauseBetweenApiCalls();
    const seasons = leagueData.data?.seasons ?? [];
    const validSeasons = seasons.filter((s: ApiSeason) => s.id > MIN_SEASON_ID);
    for (const season of validSeasons) {
      const teamsData = await seasonRepo.fetchSeasonsTeams(season.id);
      await pauseBetweenApiCalls();
      const teams = teamsData.data?.teams ?? [];
      if (!teams.length) {
        console.warn(`No teams found for season ${season.id}`);
        continue;
      }
      const newTeams = (teams as ApiTeam[]).filter(
        (t) => !upsertedTeamIds.has(t.id)
      );
      for (const t of newTeams) {
        const data = {
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
        };
        await prisma.team.upsert({
          where: { id: t.id },
          update: data,
          create: { id: t.id, ...data },
        });
        upsertedTeamIds.add(t.id);
      }
      console.log(
        `${newTeams.length} teams upserted for season ${season.id} (${teams.length - newTeams.length} already upserted)`
      );
    }
  }
  console.log('Teams successfully inserted from seasons');
};

runScript(import.meta.url, insertTeamsFromSeasons);

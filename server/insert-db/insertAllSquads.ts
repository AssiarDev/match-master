import prisma from '../lib/prisma';
import { SportmonksError } from '../lib/sportmonksClient';
import { TeamApiRepository } from '../repositories/teamApi.repository';
import { LeagueApiRepository } from '../repositories/leagueApi.repository';
import { SeasonRepository } from '../repositories/season.repository';
import { runScript } from '../scripts/runScript';
import type { ApiSeason, ApiSquad, ApiTeam } from '../types/api';
import { findImportedLeagues, pauseBetweenApiCalls } from './importHelpers';
const teamApiRepo = new TeamApiRepository();
const leagueApiRepo = new LeagueApiRepository();
const seasonRepo = new SeasonRepository();

/** State shared by the whole import run. */
type ImportRun = {
  /** IDs of the teams in the database, loaded once instead of per player. */
  knownTeamIds: Set<number>;
  /** Squads that could not be fetched for another reason than a 404. */
  failures: number;
};

/**
 * Imports or updates the squads (players and their team membership) of the
 * current season of every league already in the database.
 * A team without squad (SportMonks 404) is skipped with a warning; any other
 * failure is counted, does not stop the import, and is reported at the end.
 * @throws If there is no league or no team in the database, or if at least
 * one squad could not be fetched
 */
export const insertAllSquads = async (): Promise<void> => {
  const leagues = await findImportedLeagues();
  const teams = await prisma.team.findMany({ select: { id: true } });
  if (teams.length === 0)
    throw new Error(
      'No team in the database: run insert-db/insertTeamsFromSeasons.ts first, or insert-db/importAll.ts for the whole import.'
    );
  const run: ImportRun = {
    knownTeamIds: new Set(teams.map((t) => t.id)),
    failures: 0,
  };

  for (const league of leagues) {
    await importLeagueSquads(run, league.id);
  }

  if (run.failures > 0)
    throw new Error(`${run.failures} squad(s) could not be fetched`);
  console.log('Squad import completed');
};

/**
 * Imports the squads of the current season of one league.
 * @param run - The state of the import run
 * @param leagueId - The ID of the league
 */
const importLeagueSquads = async (
  run: ImportRun,
  leagueId: number
): Promise<void> => {
  const leagueData = await leagueApiRepo.fetchLeagueWithSeasons(leagueId);
  await pauseBetweenApiCalls();
  const currentSeasons = (leagueData.data?.seasons ?? []).filter(
    (s: ApiSeason) => s.is_current
  );
  if (currentSeasons.length === 0) {
    console.warn(`No current season for league ${leagueId}`);
    return;
  }

  for (const season of currentSeasons) {
    const teamsData = await seasonRepo.fetchSeasonsTeams(season.id);
    await pauseBetweenApiCalls();
    const teams = teamsData.data?.teams ?? [];
    if (teams.length === 0) {
      console.warn('No teams found for season :', season.id);
      continue;
    }
    for (const team of teams) {
      await importTeamSquad(run, season.id, team);
    }
  }
};

/**
 * Imports the squad of one team for one season.
 * The entries of the squad are written in parallel, during the pause that
 * follows the API call: the next call still waits at least 1.2 s, and the
 * writes no longer add their duration to the import (ADR-18).
 * @param run - The state of the import run
 * @param seasonId - The ID of the season
 * @param team - The team, as returned by SportMonks
 */
const importTeamSquad = async (
  run: ImportRun,
  seasonId: number,
  team: ApiTeam
): Promise<void> => {
  let squads: ApiSquad[];
  try {
    squads = (await teamApiRepo.fetchTeamSquad(seasonId, team.id)).data ?? [];
  } catch (error) {
    if (error instanceof SportmonksError && error.upstreamStatus === 404) {
      console.warn(`No squad for team ${team.name} in season ${seasonId}`);
    } else {
      run.failures++;
      console.error(
        `Squad fetch failed for team ${team.name} in season ${seasonId}`,
        error
      );
    }
    await pauseBetweenApiCalls();
    return;
  }

  if (squads.length === 0)
    console.warn(`No squad found for team ${team.name} in season ${seasonId}`);
  const [, written] = await Promise.all([
    pauseBetweenApiCalls(),
    Promise.all(squads.map((squad) => upsertSquadEntry(run, seasonId, squad))),
  ]);
  const upserted = written.filter(Boolean).length;
  if (upserted > 0)
    console.log(
      `${upserted} players upserted for team ${team.name} in season ${seasonId}`
    );
};

/**
 * Upserts one player and their membership in a team for a season.
 * Skipped when the player is missing from the API response, or when the team
 * is not in the database.
 * The player is written before the squad entry, which references it.
 * @param run - The state of the import run
 * @param seasonId - The ID of the season
 * @param squad - The squad entry, as returned by SportMonks
 * @returns Whether the entry was written
 */
const upsertSquadEntry = async (
  run: ImportRun,
  seasonId: number,
  squad: ApiSquad
): Promise<boolean> => {
  const player = squad.player;
  if (!player || !player.id) {
    console.warn(
      `Player ${squad.player_id} missing in API response, skipping.`
    );
    return false;
  }
  if (!run.knownTeamIds.has(squad.team_id)) {
    console.warn(
      `Skipping squad ${squad.id} because team ${squad.team_id} does not exist in DB`
    );
    return false;
  }

  const playerData = {
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
    date_of_birth: player.date_of_birth ? new Date(player.date_of_birth) : null,
    gender: player.gender,
  };
  await prisma.player.upsert({
    where: { id: player.id },
    update: playerData,
    create: { id: player.id, ...playerData },
  });

  const squadData = {
    player_id: squad.player_id,
    team_id: squad.team_id,
    season_id: seasonId,
    position_id: squad.position_id,
    has_values: squad.has_values,
    jersey_number: squad.jersey_number,
  };
  await prisma.squad.upsert({
    where: { id: squad.id },
    update: squadData,
    create: { id: squad.id, ...squadData },
  });
  return true;
};

runScript(import.meta.url, insertAllSquads);

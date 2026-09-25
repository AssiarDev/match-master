import prisma from '../lib/prisma';
import { LeagueApiRepository } from '../repositories/leagueApi.repository';
import { runScript } from '../scripts/runScript';
import type { ApiLeague } from '../types/api';
const leagueApiRepo = new LeagueApiRepository();

/**
 * Leagues returned by SportMonks but deliberately kept out of the database.
 * Without this list, every import (including the weekly scheduled one) would
 * recreate a league deleted with scripts/delete-league.ts.
 * - 1100: Primeira Liga, inactive in our SportMonks plan (no current season),
 *   deleted on 11/06/2026.
 * To exclude a league: add its ID here, then delete it with delete-league.
 */
export const EXCLUDED_LEAGUE_IDS: readonly number[] = [1100];

/**
 * Imports or updates every league returned by SportMonks, except the
 * excluded ones.
 * `active` and `has_jerseys` are only set when the league is created, so that
 * a value changed in the database is not overwritten by an update.
 * @throws If SportMonks returns no league
 */
export const insertLeagues = async (): Promise<void> => {
  const leaguesData = await leagueApiRepo.fetchAllLeague();
  if (!Array.isArray(leaguesData?.data) || leaguesData.data.length === 0)
    throw new Error('SportMonks returned no league');

  const leagues = (leaguesData.data as ApiLeague[]).filter(
    (c) => !EXCLUDED_LEAGUE_IDS.includes(c.id)
  );
  for (const c of leagues) {
    const data = {
      country_id: c.country_id,
      name: c.name,
      short_code: c.short_code,
      image_path: c.image_path,
      type: c.type,
      sub_type: c.sub_type,
      last_played_at: c.last_played_at ? new Date(c.last_played_at) : null,
      category: c.category ?? 0,
    };
    await prisma.competitions.upsert({
      where: { id: c.id },
      update: data,
      create: { id: c.id, active: true, has_jerseys: false, ...data },
    });
  }
  console.log(
    `${leagues.length} leagues upserted, ${leaguesData.data.length - leagues.length} excluded`
  );
};

runScript(import.meta.url, insertLeagues);

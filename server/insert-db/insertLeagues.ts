import prisma from '../lib/prisma';
import { LeagueApiRepository } from '../repositories/leagueApi.repository';
import { runScript } from '../scripts/runScript';
import type { ApiLeague } from '../types/api';
const leagueApiRepo = new LeagueApiRepository();

/**
 * Imports or updates every league returned by SportMonks.
 * `active` and `has_jerseys` are only set when the league is created, so that
 * a value changed in the database is not overwritten by an update.
 * @throws If SportMonks returns no league
 */
export const insertLeagues = async (): Promise<void> => {
  const leaguesData = await leagueApiRepo.fetchAllLeague();
  if (!Array.isArray(leaguesData?.data) || leaguesData.data.length === 0)
    throw new Error('SportMonks returned no league');

  for (const c of leaguesData.data as ApiLeague[]) {
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
  console.log(`${leaguesData.data.length} leagues upserted`);
};

runScript(import.meta.url, insertLeagues);

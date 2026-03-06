import { fetchAllLeagues } from '../service/api/leagues.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const insertLeagues = async () => {
  try {
    const leaguesData = await fetchAllLeagues();
    if (!leaguesData || !Array.isArray(leaguesData.data)) {
      console.error('No leagues found');
      return;
    }

    const leagues = leaguesData.data.map((c) => ({
      id: c.id,
      country_id: c.country_id,
      name: c.name,
      active: true,
      short_code: c.short_code,
      image_path: c.image_path,
      type: c.type,
      sub_type: c.sub_type,
      last_played_at: c.last_played_at ? new Date(c.last_played_at) : null,
      category: c.category ?? 0,
      has_jerseys: false,
    }));

    await prisma.competitions.createMany({
      data: leagues,
      skipDuplicates: true,
    });

    console.log('Leagues successfully entered into the database');
  } catch (e) {
    console.error(`Error inserting leagues :`, e.message);
  }
};

insertLeagues();

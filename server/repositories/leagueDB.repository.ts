import type { Prisma } from '@prisma/client';
import prisma from '../lib/prisma';

/**
 * The competition fields returned by this repository, listed once and shared
 * by every query, so that a field is added or removed in a single place.
 */
const competitionSelect = {
  id: true,
  country_id: true,
  name: true,
  active: true,
  short_code: true,
  image_path: true,
  type: true,
  sub_type: true,
  category: true,
  has_jerseys: true,
} satisfies Prisma.CompetitionsSelect;

/** A competition as returned by this repository, derived from its select. */
export type LeagueDBResult = Prisma.CompetitionsGetPayload<{
  select: typeof competitionSelect;
}>;

export interface ILeagueDBRepository {
  findAllLeague(): Promise<LeagueDBResult[]>;
  findLeague(leagueId: number): Promise<LeagueDBResult | null>;
}

export class LeagueDBRepository implements ILeagueDBRepository {
  findAllLeague() {
    return prisma.competitions.findMany({ select: competitionSelect });
  }

  findLeague(leagueId: number) {
    return prisma.competitions.findUnique({
      where: { id: leagueId },
      select: competitionSelect,
    });
  }
}

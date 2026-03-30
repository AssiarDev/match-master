import { PrismaClient, type Competitions } from '@prisma/client';

const prisma = new PrismaClient();

export type LeagueDBResult = {
  id: number;
  country_id: number | null;
  name: string;
  active: boolean;
  short_code: string | null;
  image_path: string | null;
  type: string;
  sub_type: string | null;
  category: number;
  has_jerseys: boolean;
};

export interface ILeagueDBRepository {
  findAllLeague(): Promise<LeagueDBResult[]>;
  findLeague(leagueId: number): Promise<LeagueDBResult | null>;
}

export class LeagueDBRepository implements ILeagueDBRepository {
  findAllLeague() {
    return prisma.competitions.findMany({
      select: {
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
      },
    });
  }

  findLeague(leagueId: number) {
    return prisma.competitions.findUnique({
      where: { id: leagueId },
      select: {
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
      },
    });
  }
}

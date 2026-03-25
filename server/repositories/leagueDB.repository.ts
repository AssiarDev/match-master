import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class LeagueDBRepository {
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

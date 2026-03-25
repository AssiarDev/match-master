import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class TeamDBRepository {
  findAllTeams() {
    return prisma.team.findMany({
      select: { id: true, name: true, image_path: true },
    });
  }

  findByIds(teamIds: number[]) {
    return prisma.team.findMany({
      where: { id: { in: teamIds } },
    });
  }

  findById(teamId: number) {
    return prisma.team.findUnique({
      where: { id: teamId },
    });
  }

  findByLeague(leagueId: number) {
    return prisma.competitions.findUnique({
      where: { id: leagueId },
      include: { teams: { include: { team: true } } },
    });
  }
}

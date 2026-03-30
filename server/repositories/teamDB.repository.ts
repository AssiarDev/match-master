import { PrismaClient, type Team } from '@prisma/client';

const prisma = new PrismaClient();

export type LeagueWithTeams = {
  id: number;
  name: string;
  teams: Array<{
    team: Team;
  }>;
};

export interface ITeamDBRepository {
  findAllTeams(): Promise<
    Array<{ id: number; name: string; image_path: string | null }>
  >;
  findByIds(teamIds: number[]): Promise<Team[]>;
  findById(teamId: number): Promise<Team | null>;
  findByLeague(leagueId: number): Promise<LeagueWithTeams | null>;
}

export class TeamDBRepository implements ITeamDBRepository {
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

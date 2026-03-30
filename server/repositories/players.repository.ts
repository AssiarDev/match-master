import { PrismaClient, type Player } from '@prisma/client';

const prisma = new PrismaClient();

export interface IPlayersRepository {
  findPlayersByIds(playerIds: number[]): Promise<Player[]>;
}

export class PlayersRepository implements IPlayersRepository {
  findPlayersByIds(playerIds: number[]) {
    return prisma.player.findMany({
      where: { id: { in: playerIds } },
    });
  }
}

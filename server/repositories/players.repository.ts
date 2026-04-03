import { type Player } from '@prisma/client';
import prisma from '../lib/prisma';

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

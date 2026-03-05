import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

export const getPlayersByIds = async (playerIds) => {
  return prisma.player.findMany({
    where: {
      id: { in: playerIds }
    }
  });
};
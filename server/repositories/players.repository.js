import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

export class PlayersRepository{
    findPlayersByIds(playerIds){
        return prisma.player.findMany({
            where: {
                id: { in: playerIds }
            }
        })
    }
}
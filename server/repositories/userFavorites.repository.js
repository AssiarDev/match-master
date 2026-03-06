import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient()

export class UserFavoritesRepository {
    find(userId, teamId){
        return prisma.userFavorite.findFirst({
            where: { user_id: userId, team_id: teamId}
        })
    }

    create(userId, teamId){
        return prisma.userFavorite.create({
            data: { user_id: userId, team_id: teamId }
        })
    }

    delete(userId, teamId){
        return prisma.userFavorite.delete({
            where: {
                user_id_team_id: {
                    user_id: userId,
                    team_id: teamId
                }
            }
        })
    }

    findAllByUser(userId){
        return prisma.userFavorite.findMany({
            where: { user_id: userId},
            include: {
                team: {
                    select: {
                        id: true,
                        name: true,
                        image_path: true,
                        competitions: {
                            include: {
                                competition: {
                                    select: { id: true, name: true }
                                }
                            }
                        }
                    }
                }
            }
        })
    }
}
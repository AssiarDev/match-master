import { PrismaClient, type UserFavorite } from '@prisma/client';

const prisma = new PrismaClient();

export type FavoriteWithTeam = {
  team: {
    id: number;
    name: string;
    image_path: string | null;
    competitions: Array<{
      competition: { id: number; name: string };
    }>;
  } | null;
};

export interface IUserFavoritesRepository {
  find(userId: number, teamId: number): Promise<UserFavorite | null>;
  create(userId: number, teamId: number): Promise<UserFavorite>;
  delete(userId: number, teamId: number): Promise<UserFavorite>;
  findAllByUser(userId: number): Promise<FavoriteWithTeam[]>;
}

export class UserFavoritesRepository implements IUserFavoritesRepository {
  find(userId: number, teamId: number) {
    return prisma.userFavorite.findFirst({
      where: { user_id: userId, team_id: teamId },
    });
  }

  create(userId: number, teamId: number) {
    return prisma.userFavorite.create({
      data: { user_id: userId, team_id: teamId },
    });
  }

  delete(userId: number, teamId: number) {
    return prisma.userFavorite.delete({
      where: {
        user_id_team_id: { user_id: userId, team_id: teamId },
      },
    });
  }

  findAllByUser(userId: number) {
    return prisma.userFavorite.findMany({
      where: { user_id: userId },
      include: {
        team: {
          select: {
            id: true,
            name: true,
            image_path: true,
            competitions: {
              include: {
                competition: {
                  select: { id: true, name: true },
                },
              },
            },
          },
        },
      },
    });
  }
}

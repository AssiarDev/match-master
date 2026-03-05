import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const deleteFavoriteUser = async (userId, clubId) => {
  try {
    const userExists = await prisma.user.findUnique({ where: { id: userId } });

    if (!userExists) {
      console.warn(`L'utilisateur ID ${userId} n'existe pas.`);
      return {
        success: false,
        message: `L'utilisateur ID: ${userId} n'éxiste pas.`,
      };
    }

    const clubExists = await prisma.team.findUnique({ where: { id: clubId } });

    if (!clubExists) {
      console.warn(`Le club ID : ${clubId} n'existe pas.`);
      return {
        success: false,
        message: `Le club ID : ${clubId} n'éxiste pas.`,
      };
    }

    const existingFavorite = await prisma.userFavorite.findFirst({
      where: { user_id: userId, team_id: clubId },
    });

    if (!existingFavorite) {
      console.warn(
        `Le favori entre user ${userId} et club ${clubId} n'existe pas.`
      );
      return { success: false, message: "Ce favori n'existe pas." };
    }

    await prisma.userFavorite.delete({
      where: { user_id_team_id: {
        user_id: userId,
        team_id: clubId
      } },
    });

    console.log(`Club ${clubId} supprimer des favoris de l'utilisateur.`);
    return {
      success: true,
      message: `Club ${clubId} supprimer des favoris de l'utilisateur.`,
    };
  } catch (e) {
    console.error('Erreur lors de la suppression des favoris :', e.message);
    return {
      success: false,
      message: 'Erreur lors de la suppression des favoris.',
    };
  }
};

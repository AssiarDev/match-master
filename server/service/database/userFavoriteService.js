import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const insertUsersFavorite = async (userId, clubId) => {
  try {
    const userExists = await prisma.user.findUnique({ where: { id: userId } });

    if (!userExists) {
      console.warn(`L'utilisateur ID ${userId} n'existe pas.`);
      return {
        success: false,
        message: `L'utilisateur ID ${userId} n'existe pas.`,
      };
    }

    const clubExists = await prisma.team.findUnique({
      where: { id: clubId },
    });

    if (!clubExists) {
      console.warn(`Le club ID ${clubId} n'existe pas.`);
      return { success: false, message: `Le club ID ${clubId} n'existe pas.` };
    }

    const existingFavorite = await prisma.userFavorite.findFirst({
      where: { 
        user_id: userId, 
        team_id: clubId 
      },
    });

    if (existingFavorite) {
      return {
        success: true,
        message: "Déjà dans les favoris."
      };
    }

    await prisma.userFavorite.create({
        data: {
          user_id: userId,
          team_id: clubId
        }
    });

    return {
      success: true,
      message: `Club ${clubId} ajouté aux favoris de l'utilisateur ${userId}`,
    };
  } catch (e) {
    console.error("Erreur lors de l'ajout aux favoris :", e.message);
    return { success: false, message: "Erreur lors de l'ajout aux favoris." };
  }
};

export const getUserFavorites = async (userId) => {
  try {
    const userExists = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });

    if (!userExists) {
      console.warn(`Aucun utilisateur trouvé avec l'ID ${userId}.`);
      return [];
    }

    const favorites = await prisma.userFavorite.findMany({
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
                  select: {
                    id: true,
                    name: true,
                  },
                },
              }
            },
          },
        },
      },
    });

    return favorites.map((fav) => ({
      id: fav.team.id,
      name: fav.team.name,
      emblem: fav.team.image_path,
      leagueId: fav.team.competitions?.[0]?.competition?.id || null,
      leagueName: fav.team.competitions?.[0]?.competition?.name || 'Compétition inconnue',
    }));
  } catch (e) {
    console.error(
      'Erreur lors de la récupération des équipes favorites :',
      e.message
    );
    throw e;
  }
};

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
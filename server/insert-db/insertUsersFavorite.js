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
      //select: { id_competition: true },
    });

    if (!clubExists) {
      console.warn(`Le club ID ${clubId} n'existe pas.`);
      return { success: false, message: `Le club ID ${clubId} n'existe pas.` };
    }

    //const competitionId = clubExists?.id_competition;

    // Trouver l'entrée existante dans UsersFavorites
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


    // Insérer ou ignorer la relation utilisateur-club
    await prisma.userFavorite.create({
      // where: {
      //   id: existingFavorite?.id || 0,
      // },
        data: {
          user_id: userId,
          team_id: clubId
        }
        //competitionId,
    });

    console.log(`Club ${clubId} ajouté aux favoris de l'utilisateur ${userId}`);
    return {
      success: true,
      message: `Club ${clubId} ajouté aux favoris de l'utilisateur ${userId}`,
    };
  } catch (e) {
    console.error("Erreur lors de l'ajout aux favoris :", e.message);
    return { success: false, message: "Erreur lors de l'ajout aux favoris." };
  }
};

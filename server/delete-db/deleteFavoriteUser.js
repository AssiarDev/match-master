import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const deleteFavoriteUser = async (userId, clubId) => {
    try {
        const userExists = await prisma.user.findUnique({ where: { id: userId }});
        const clubExists = await prisma.club.findUnique({ where: { id: clubId }});

        if(!userExists){
            console.warn(`L'utilisateur ID ${userId} n'existe pas.`);
            return { success: false, message: `L'utilisateur ID: ${userId} n'éxiste pas.`};
        }

        if(!clubExists){
            console.warn(`Le club ID : ${clubId} n'existe pas.`);
            return { success: false, message: `Le club ID : ${clubId} n'éxiste pas.`};
        }

        const existingFavorite = await prisma.usersFavorites.findFirst({
            where: { userId, clubId }
        });

        if (!existingFavorite) {
            console.warn(`Le favori entre user ${userId} et club ${clubId} n'existe pas.`);
            return { success: false, message: "Ce favori n'existe pas." };
        }

        await prisma.usersFavorites.delete({
            where: { id: existingFavorite.id }
        });

        console.log(`Club ${clubId} supprimer des favoris de l'utilisateur.`);
        return { success: true, message: `Club ${clubId} supprimer des favoris de l'utilisateur.`}

    } catch (e) {
        console.error("Erreur lors de la suppression des favoris :", e.message);
        return { success: false, message: "Erreur lors de la suppression des favoris." };
    }
}
import { PrismaClient } from "@prisma/client";
import pool from '../db/db.js'

const prisma = new PrismaClient()

const insertUsersFavorite = async (userId, clubId) => {
    try {
        const userExists = await prisma.user.findUnique({ where: { id: userId } });
        const clubExists = await prisma.club.findUnique({ where: { id: clubId } });

        if (!userExists) {
            console.warn(`L'utilisateur ID ${userId} n'existe pas.`);
            return { success: false, message: `L'utilisateur ID ${userId} n'existe pas.` };
        }

        if (!clubExists) {
            console.warn(`Le club ID ${clubId} n'existe pas.`);
            return { success: false, message: `Le club ID ${clubId} n'existe pas.` };
        }

        // Trouver l'entrée existante dans UsersFavorites
        const existingFavorite = await prisma.usersFavorites.findFirst({
            where: { userId, clubId }
        });


        // Insérer ou ignorer la relation utilisateur-club
        await prisma.usersFavorites.upsert({
            where: {
                id: existingFavorite?.id || 0
            },
            update: {}, // Ne rien modifier si déjà existant
            create: {
                userId,
                clubId
            }
        });

        console.log(`Club ${clubId} ajouté aux favoris de l'utilisateur ${userId}`);
        return { success: true, message: `Club ${clubId} ajouté aux favoris de l'utilisateur ${userId}` };

    } catch (e) {
        console.error("Erreur lors de l'ajout aux favoris :", e.message);
        return { success: false, message: "Erreur lors de l'ajout aux favoris." };
    }
};

//insertUsersFavorite(1, 524);
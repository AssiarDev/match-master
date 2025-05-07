import { PrismaClient } from '@prisma/client';
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export const getTeamByClubName = async (clubName) => {
    try {
        const club = await prisma.club.findUnique({
            where: { name: clubName },
            select: { id: true }
        });

        if (!club) {
            console.warn(`Aucun club trouvé avec le nom "${clubName}".`);
            return [];
        }

        const team = await prisma.player.findMany({
            where: { id_club: club.id },
            select: {
                id: true,
                name: true,
                position: true,
                date_of_birth: true,
                nationality: true,
                club: { select: { name: true } }
            }
        });

        return team;
    } catch (error) {
        console.error("Erreur lors de la récupération de l'équipe :", error.message);
        throw error;
    }
};

export const getUserFavorites = async (userId) => {
    try {
        const userExists = await prisma.user.findUnique({
            where: { id: userId },
            select: { id: true }
        });

        if (!userExists) {
            console.warn(`Aucun utilisateur trouvé avec l'ID ${userId}.`);
            return [];
        }

        const favorites = await prisma.usersFavorites.findMany({
            where: { userId },
            include: {
                club: {
                    select: { id: true, name: true, emblem: true }
                }
            }
        });

        return favorites.map(fav => fav.club);
    } catch (e) {
        console.error("Erreur lors de la récupération des équipes favorites :", e.message);
        throw e;
    }
};

export const getAllUsers = async () => {
    try {
        const users = await prisma.user.findMany(); 
        return users;
    } catch (e) {
        console.error("Erreur lors de la récupération des utilisateurs :", e.message);
        throw e;
    }
};


export const deleteUsers = async (id) => {
    try {
        const deletedUser = await prisma.user.delete({
            where: { id }
        });

        return deletedUser;
    } catch (e) {
        console.error("Erreur lors de la suppression de l'utilisateur :", e.message);
        throw e;
    }
};


export const updateUsers = async (id, data) => {
    try {
        const updatedUser = await prisma.user.update({
            where: { id },
            data: {
                username: data.username,
                email: data.email
            }
        });

        return { message: "Utilisateur mis à jour avec succès", user: updatedUser };
    } catch (e) {
        console.error("Erreur lors de la mise à jour de l'utilisateur :", e.message);
        
        if (e.code === "P2025") {
            return { error: "Utilisateur introuvable" }; // Gère l'erreur Prisma si l'utilisateur n'existe pas
        }

        throw e; 
    }
};


export const login = async (mail, password) => {
    try {
        const user = await prisma.user.findUnique({
            where: { mail },
            select: { id: true, mail: true, username: true, password: true }
        });

        if (!user) {
            console.error("Utilisateur non trouvé.");
            return { success: false, message: "Utilisateur introuvable" };
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            console.error("Mot de passe incorrect.");
            return { success: false, message: "Mot de passe incorrect" };
        }

        // Générer un token JWT
        const token = jwt.sign(
            { id: user.id, email: user.mail, username: user.username },
            process.env.SECRET_KEY,
            { expiresIn: "1h" }
        );

        console.log("Connexion réussie.");
        return { success: true, token };

    } catch (e) {
        console.error("Erreur lors de la connexion :", e.message);
        return { success: false, message: "Erreur serveur" };
    }
};

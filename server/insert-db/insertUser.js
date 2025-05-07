import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const insertUser = async (username, mail, password) => {
    try {
        // Vérifier si l'utilisateur existe déjà
        const existingUser = await prisma.user.findUnique({
            where: { mail }
        });

        if (existingUser) {
            console.warn(`Un utilisateur avec l'email ${mail} existe déjà.`);
            return null;
        }

        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);

        const newUser = await prisma.user.create({
            data: {
                username,
                mail,
                password: hashedPassword
            }
        });

        console.log("Utilisateur créé avec succès :", newUser);
        return newUser;

    } catch (e) {
        console.error("Erreur lors de l'insertion de l'utilisateur :", e.message);
        console.log(e.stack);
        return null;
    } 
};

//insertUser('RaissaAli', 'test@test.com', '1234')
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getCompetitionsIds = async () => {
    try {
        const competitions = await prisma.competition.findMany({
            select: { id: true }
        });
        return competitions.map(c => c.id);
    } catch (error) {
        console.error("Erreur Prisma dans getCompetitionById :", error);
        throw error
    }
};
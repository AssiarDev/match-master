import { PrismaClient } from "@prisma/client";
import { fetchAllCompetitions } from "../service/api/competitionsApi.js";

const prisma = new PrismaClient();

export const updateSeasonCount = async () => {
    try {
        const data = await fetchAllCompetitions();
        if(!data || !Array.isArray(data.competitions)){
            console.error('Aucune compétition trouvée.')
            return;
        }

        for (const comp of data.competitions.filter(c => c.type === "LEAGUE")) {
            await prisma.competition.update({
                where: { id: comp.id },
                data: { nbSeasons: comp.numberOfAvailableSeasons || 1 },
            });
        }

        console.log("Mise à jour des saisons terminée.");
    } catch (error) {
        console.error("Erreur Prisma :", error.message);
    } finally {
        await prisma.$disconnect();
    }
}

updateSeasonCount();


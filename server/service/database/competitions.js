import { Prisma } from "@prisma/client";

const prisma = new Prisma.Client();

export const getCompetitionById = async () => {
    const competitions = await prisma.competition.findMany({
        select: { id: true }
    });
    return competitions.map(comp => comp.id);
}
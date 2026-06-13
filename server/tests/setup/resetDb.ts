import prisma from '../../lib/prisma.js';

export async function resetDb() {
  await prisma.userFavorite.deleteMany();
  await prisma.squad.deleteMany();
  await prisma.teamCompetition.deleteMany();
  await prisma.user.deleteMany();
  await prisma.player.deleteMany();
  await prisma.team.deleteMany();
  await prisma.competitions.deleteMany();
  await prisma.season.deleteMany();
}

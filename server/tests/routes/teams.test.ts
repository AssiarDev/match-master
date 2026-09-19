import request from 'supertest';
import { app } from '../../app';
import prisma from '../../lib/prisma';
import { resetDb } from '../setup/resetDb';

describe('Teams routes', () => {
  beforeEach(async () => {
    await resetDb();
  });

  describe('GET /teams', () => {
    it('retourne un tableau vide si aucune équipe en base', async () => {
      const response = await request(app).get('/teams');
      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });

    it('retourne la liste des équipes présentes en base', async () => {
      await prisma.team.create({
        data: { id: 1, name: 'Paris Saint-Germain' },
      });
      await prisma.team.create({
        data: { id: 2, name: 'Paris FC' },
      });

      const response = await request(app).get('/teams');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body[0]).toMatchObject({
        id: 1,
        name: 'Paris Saint-Germain',
      });
      expect(response.body[1]).toMatchObject({ id: 2, name: 'Paris FC' });
    });
  });

  describe('GET /teams/:id', () => {
    it("retourne l'équipe correspondant à l'id", async () => {
      await prisma.team.create({
        data: { id: 10, name: 'AS Monaco' },
      });

      const response = await request(app).get('/teams/10');

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({ id: 10, name: 'AS Monaco' });
    });

    it("retourne 404 si l'équipe n'existe pas", async () => {
      const response = await request(app).get('/teams/999');

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: "Equipe introuvable via l'id." });
    });

    it.each(['abc', '12abc', '0'])(
      "retourne 400 si l'id vaut %p",
      async (id) => {
        const response = await request(app).get(`/teams/${id}`);

        expect(response.status).toBe(400);
        expect(response.body).toEqual({ error: 'Identifiant invalide.' });
      }
    );
  });
});

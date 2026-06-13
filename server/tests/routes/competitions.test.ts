import { jest } from '@jest/globals';
import request from 'supertest';
import { app } from '../../app';
import prisma from '../../lib/prisma';
import { resetDb } from '../setup/resetDb';

const mockFetch = (data: unknown) =>
  Promise.resolve({ ok: true, json: () => Promise.resolve(data) } as Response);

describe('Competitions routes', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  beforeEach(async () => {
    await resetDb();
  });

  describe('GET /competitions', () => {
    it('retourne un tableau vide si aucune compétition en base', async () => {
      const response = await request(app).get('/competitions');

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });

    it('retourne la liste des compétitions présentes en base', async () => {
      await prisma.competitions.create({
        data: { id: 1, name: 'Ligue 1', type: 'league', category: 1 },
      });

      const response = await request(app).get('/competitions');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0]).toMatchObject({ id: 1, name: 'Ligue 1' });
    });
  });

  describe('GET /competitions/:id/teams', () => {
    it("retourne 500 si la compétition n'existe pas", async () => {
      const response = await request(app).get('/competitions/999/teams');

      expect(response.status).toBe(500);
    });

    it('retourne les équipes de la compétition', async () => {
      await prisma.competitions.create({
        data: { id: 1, name: 'Ligue 1', type: 'league', category: 1 },
      });
      await prisma.team.create({ data: { id: 1, name: 'PSG' } });
      await prisma.teamCompetition.create({
        data: { team_id: 1, competition_id: 1 },
      });

      const response = await request(app).get('/competitions/1/teams');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0].team).toMatchObject({ id: 1, name: 'PSG' });
    });
  });

  describe('GET /competitions/matches', () => {
    it('retourne 400 si la date est manquante', async () => {
      const response = await request(app).get('/competitions/matches');

      expect(response.status).toBe(400);
      expect(response.body).toMatchObject({ error: 'La date est obligatoire' });
    });

    it('retourne 200 et les matchs groupés par ligue', async () => {
      jest
        .spyOn(globalThis, 'fetch')
        .mockImplementationOnce(() => mockFetch({ data: [] }));

      const response = await request(app).get(
        '/competitions/matches?date=2024-01-15'
      );

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({ data: {} });
    });
  });

  describe('GET /competitions/:id/matches', () => {
    it("retourne 400 si l'id est invalide", async () => {
      const response = await request(app).get('/competitions/abc/matches');

      expect(response.status).toBe(400);
    });

    it('retourne 200 et les matchs de la saison courante', async () => {
      jest
        .spyOn(globalThis, 'fetch')
        .mockImplementationOnce(() =>
          mockFetch({
            data: { currentseason: { id: 42, starting_at: '2024-01-01' } },
          })
        )
        .mockImplementationOnce(() => mockFetch({ data: [] }));

      const response = await request(app).get('/competitions/271/matches');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('GET /teams/:teamId/matches', () => {
    it("retourne 400 si l'id est invalide", async () => {
      const response = await request(app).get('/teams/abc/matches');

      expect(response.status).toBe(400);
    });

    it("retourne 200 et les matchs de l'équipe", async () => {
      jest
        .spyOn(globalThis, 'fetch')
        .mockImplementationOnce(() => mockFetch({ data: [] }));

      const response = await request(app).get('/teams/1/matches');

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({ data: [] });
    });
  });

  describe('GET /matches/live', () => {
    it('retourne 200 et les matchs en direct', async () => {
      jest
        .spyOn(globalThis, 'fetch')
        .mockImplementationOnce(() => mockFetch({ data: [] }));

      const response = await request(app).get('/matches/live');

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({ data: [] });
    });
  });
});

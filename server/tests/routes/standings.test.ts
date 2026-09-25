import { jest } from '@jest/globals';
import request from 'supertest';
import { app } from '../../app';
import prisma from '../../lib/prisma';
import { resetDb } from '../setup/resetDb';

const mockFetch = (data: unknown) =>
  Promise.resolve({ ok: true, json: () => Promise.resolve(data) } as Response);

describe('Standings routes', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  beforeEach(async () => {
    await resetDb();
  });

  describe('GET /standings/:id', () => {
    it("retourne 400 si l'id est invalide", async () => {
      const response = await request(app).get('/standings/abc');

      expect(response.status).toBe(400);
    });

    it('retourne 200 et le classement enrichi', async () => {
      await prisma.team.create({ data: { id: 1, name: 'PSG' } });

      jest
        .spyOn(globalThis, 'fetch')
        .mockImplementationOnce(() =>
          mockFetch({
            data: { currentseason: { id: 42, starting_at: '2024-01-01' } },
          })
        )
        .mockImplementationOnce(() =>
          mockFetch({
            data: [{ participant_id: 1, team_id: 1, position: 1, details: [] }],
          })
        );

      const response = await request(app).get('/standings/271');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body[0]).toMatchObject({ team_name: 'PSG', team_id: 1 });
    });

    it("retourne 404 si la compétition n'a pas de saison en cours", async () => {
      jest
        .spyOn(globalThis, 'fetch')
        .mockImplementationOnce(() => mockFetch({ data: {} }));

      const response = await request(app).get('/standings/271');

      expect(response.status).toBe(404);
      expect(response.body).toEqual({
        error: 'Aucune saison en cours pour cette compétition.',
      });
    });

    it("retourne 500 sans détail technique si l'API externe est en panne", async () => {
      jest.spyOn(console, 'error').mockImplementation(() => {});
      jest
        .spyOn(globalThis, 'fetch')
        .mockRejectedValueOnce(
          new Error(
            'fetch failed: https://api.sportmonks.com/v3/football/leagues/271?api_token=SECRET'
          )
        );

      const response = await request(app).get('/standings/271');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Erreur serveur' });
      expect(JSON.stringify(response.body)).not.toMatch(/api_token|sportmonks/);
    });
  });
});

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
  });
});

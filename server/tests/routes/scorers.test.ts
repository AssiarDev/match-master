import { jest } from '@jest/globals';
import request from 'supertest';
import { app } from '../../app';
import prisma from '../../lib/prisma';
import { resetDb } from '../setup/resetDb';

const mockFetch = (data: unknown) =>
  Promise.resolve({ ok: true, json: () => Promise.resolve(data) } as Response);

describe('Scorers routes', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  beforeEach(async () => {
    await resetDb();
  });

  describe('GET /scorers/:id', () => {
    it('retourne 200 et la liste des meilleurs buteurs', async () => {
      await prisma.player.create({
        data: { id: 1, display_name: 'Kylian Mbappé' },
      });

      jest
        .spyOn(globalThis, 'fetch')
        .mockImplementationOnce(() =>
          mockFetch({
            data: { currentseason: { id: 42, starting_at: '2024-01-01' } },
          })
        )
        .mockImplementationOnce(() =>
          mockFetch({ data: [{ player_id: 1, participant_id: 1, goals: 20 }] })
        );

      const response = await request(app).get('/scorers/271');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body[0]).toMatchObject({
        player_name: 'Kylian Mbappé',
        goals: 20,
      });
    });
  });
});

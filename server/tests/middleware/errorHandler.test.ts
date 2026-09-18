import { jest } from '@jest/globals';
import express from 'express';
import request from 'supertest';
import { app } from '../../app';
import { errorHandler, notFoundHandler } from '../../middleware/errorHandler';

/** Minimal app whose only route throws, to reach the error middleware. */
const makeFailingApp = (error: unknown) => {
  const failingApp = express();
  failingApp.use(express.json());
  failingApp.get('/boom', async () => {
    throw error;
  });
  failingApp.post('/echo', (req, res) => {
    res.json(req.body);
  });
  failingApp.use(notFoundHandler);
  failingApp.use(errorHandler);
  return failingApp;
};

describe('errorHandler', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('répond 404 au format unique pour une route inconnue', async () => {
    const response = await request(app).get('/route-qui-nexiste-pas');

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: 'Route introuvable.' });
  });

  it('répond 500 sans détail technique quand un handler async lève une erreur', async () => {
    const consoleError = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    const failingApp = makeFailingApp(
      new Error('connect ECONNREFUSED 10.0.0.12:5432')
    );

    const response = await request(failingApp).get('/boom');

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: 'Erreur serveur' });
    expect(JSON.stringify(response.body)).not.toContain('ECONNREFUSED');
    expect(consoleError).toHaveBeenCalled();
  });

  it('répond 400 pour un corps JSON mal formé', async () => {
    const response = await request(makeFailingApp(null))
      .post('/echo')
      .set('Content-Type', 'application/json')
      .send('{ "clubId": ');

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'Requête invalide.' });
  });
});

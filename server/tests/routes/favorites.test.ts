import request from 'supertest';
import jwt from 'jsonwebtoken';
import { app } from '../../app';
import prisma from '../../lib/prisma';
import { resetDb } from '../setup/resetDb';

const SECRET_KEY = 'test-secret-key';

const makeToken = (userId: number) =>
  jwt.sign(
    {
      id: userId,
      email: 'test@test.com',
      username: 'testuser',
      createdAt: new Date(),
    },
    SECRET_KEY
  );

describe('Favorites routes', () => {
  beforeEach(async () => {
    await resetDb();
  });

  it('retourne 401 sans token sur toutes les routes protégées', async () => {
    const response = await request(app)
      .post('/protected/users/favorites')
      .send({ clubId: 1 });
    expect(response.status).toBe(401);
  });

  describe('POST /protected/users/favorites', () => {
    it('retourne 400 si clubId est manquant', async () => {
      const user = await prisma.user.create({
        data: {
          username: 'testuser',
          email: 'test@test.com',
          password: 'hashed',
        },
      });

      const response = await request(app)
        .post('/protected/users/favorites')
        .set('Cookie', [`token=${makeToken(user.id)}`])
        .send({});

      expect(response.status).toBe(400);
      expect(response.body).toMatchObject({ error: 'clubId est requis.' });
    });

    it('retourne 201 si le favori est ajouté', async () => {
      const user = await prisma.user.create({
        data: {
          username: 'testuser',
          email: 'test@test.com',
          password: 'hashed',
        },
      });
      await prisma.team.create({ data: { id: 1, name: 'PSG' } });

      const response = await request(app)
        .post('/protected/users/favorites')
        .set('Cookie', [`token=${makeToken(user.id)}`])
        .send({ clubId: 1 });

      expect(response.status).toBe(201);
      expect(response.body).toMatchObject({ message: 'Favori ajouté.' });
    });
  });

  describe('DELETE /protected/users/favorites/:clubId', () => {
    it('retourne 200 si le favori est supprimé', async () => {
      const user = await prisma.user.create({
        data: {
          username: 'testuser',
          email: 'test@test.com',
          password: 'hashed',
        },
      });
      await prisma.team.create({ data: { id: 1, name: 'PSG' } });
      await prisma.userFavorite.create({
        data: { user_id: user.id, team_id: 1 },
      });

      const response = await request(app)
        .delete('/protected/users/favorites/1')
        .set('Cookie', [`token=${makeToken(user.id)}`]);

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({ message: 'Favoris supprimé.' });
    });
  });

  describe('GET /protected/users/:usersId/favorites', () => {
    it('retourne un tableau vide si aucun favori', async () => {
      const user = await prisma.user.create({
        data: {
          username: 'testuser',
          email: 'test@test.com',
          password: 'hashed',
        },
      });

      const response = await request(app)
        .get(`/protected/users/${user.id}/favorites`)
        .set('Cookie', [`token=${makeToken(user.id)}`]);

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });

    it('retourne la liste des favoris', async () => {
      const user = await prisma.user.create({
        data: {
          username: 'testuser',
          email: 'test@test.com',
          password: 'hashed',
        },
      });
      await prisma.team.create({ data: { id: 1, name: 'PSG' } });
      await prisma.userFavorite.create({
        data: { user_id: user.id, team_id: 1 },
      });

      const response = await request(app)
        .get(`/protected/users/${user.id}/favorites`)
        .set('Cookie', [`token=${makeToken(user.id)}`]);

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0]).toMatchObject({ id: 1, name: 'PSG' });
    });
  });

  describe('POST /protected/users/favorites-leagues', () => {
    it('retourne 201 si la ligue est ajoutée aux favoris', async () => {
      const user = await prisma.user.create({
        data: {
          username: 'testuser',
          email: 'test@test.com',
          password: 'hashed',
        },
      });
      await prisma.competitions.create({
        data: { id: 10, name: 'Ligue 1', type: 'league', category: 1 },
      });

      const response = await request(app)
        .post('/protected/users/favorites-leagues')
        .set('Cookie', [`token=${makeToken(user.id)}`])
        .send({ leagueId: 10 });

      expect(response.status).toBe(201);
      expect(response.body).toMatchObject({
        message: 'La compétition à bien été ajouté.',
      });
    });
  });

  describe('DELETE /protected/users/favorites-leagues/:leagueId', () => {
    it('retourne 200 si la ligue est supprimée des favoris', async () => {
      const user = await prisma.user.create({
        data: {
          username: 'testuser',
          email: 'test@test.com',
          password: 'hashed',
        },
      });
      await prisma.competitions.create({
        data: { id: 10, name: 'Ligue 1', type: 'league', category: 1 },
      });
      await prisma.userFavorite.create({
        data: { user_id: user.id, competition_id: 10 },
      });

      const response = await request(app)
        .delete('/protected/users/favorites-leagues/10')
        .set('Cookie', [`token=${makeToken(user.id)}`]);

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        message: 'La compétition à bien été supprimé de vos favoris.',
      });
    });
  });
});

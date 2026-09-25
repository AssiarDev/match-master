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
      expect(response.body).toEqual({ error: 'Identifiant invalide.' });
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

    it('returns 200 without duplicating when the team is already a favorite', async () => {
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
        .post('/protected/users/favorites')
        .set('Cookie', [`token=${makeToken(user.id)}`])
        .send({ clubId: 1 });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        message: 'Equipe déjà dans les favoris.',
      });
      expect(
        await prisma.userFavorite.count({ where: { user_id: user.id } })
      ).toBe(1);
    });

    it("retourne 404 si l'équipe n'existe pas", async () => {
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
        .send({ clubId: 999 });

      expect(response.status).toBe(404);
      expect(response.body).toMatchObject({ error: 'Equipe introuvable.' });
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

    it("retourne 404 si le favori n'existe pas", async () => {
      const user = await prisma.user.create({
        data: {
          username: 'testuser',
          email: 'test@test.com',
          password: 'hashed',
        },
      });

      const response = await request(app)
        .delete('/protected/users/favorites/999')
        .set('Cookie', [`token=${makeToken(user.id)}`]);

      expect(response.status).toBe(404);
      expect(response.body).toMatchObject({
        error: "Ce favoris n'existe pas.",
      });
    });
  });

  describe('GET /protected/users/:userId/favorites', () => {
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

    it('returns only teams when the user also has favorite competitions', async () => {
      const user = await prisma.user.create({
        data: {
          username: 'testuser',
          email: 'test@test.com',
          password: 'hashed',
        },
      });
      await prisma.team.create({ data: { id: 1, name: 'PSG' } });
      await prisma.competitions.create({
        data: { id: 10, name: 'Ligue 1', type: 'league', category: 1 },
      });
      await prisma.userFavorite.createMany({
        data: [
          { user_id: user.id, team_id: 1 },
          { user_id: user.id, competition_id: 10 },
        ],
      });

      const teams = await request(app)
        .get(`/protected/users/${user.id}/favorites`)
        .set('Cookie', [`token=${makeToken(user.id)}`]);
      const competitions = await request(app)
        .get(`/protected/users/${user.id}/favorites-leagues`)
        .set('Cookie', [`token=${makeToken(user.id)}`]);

      expect(teams.body).toEqual([expect.objectContaining({ id: 1 })]);
      expect(competitions.body).toEqual([expect.objectContaining({ id: 10 })]);
    });

    it('returns 404 when the user no longer exists', async () => {
      const user = await prisma.user.create({
        data: {
          username: 'testuser',
          email: 'test@test.com',
          password: 'hashed',
        },
      });
      await prisma.user.delete({ where: { id: user.id } });

      const response = await request(app)
        .get(`/protected/users/${user.id}/favorites`)
        .set('Cookie', [`token=${makeToken(user.id)}`]);

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'Utilisateur introuvable.' });
    });

    it("retourne 403 si l'utilisateur lit les favoris d'un autre compte", async () => {
      const user = await prisma.user.create({
        data: {
          username: 'testuser',
          email: 'test@test.com',
          password: 'hashed',
        },
      });
      const otherUser = await prisma.user.create({
        data: {
          username: 'otheruser',
          email: 'other@test.com',
          password: 'hashed',
        },
      });
      await prisma.team.create({ data: { id: 1, name: 'PSG' } });
      await prisma.userFavorite.create({
        data: { user_id: otherUser.id, team_id: 1 },
      });

      const response = await request(app)
        .get(`/protected/users/${otherUser.id}/favorites`)
        .set('Cookie', [`token=${makeToken(user.id)}`]);

      expect(response.status).toBe(403);
      expect(response.body).toEqual({ error: 'Action non autorisée' });
    });
  });

  describe('GET /protected/users/:userId/favorites-leagues', () => {
    it('retourne la liste des compétitions favorites', async () => {
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
        .get(`/protected/users/${user.id}/favorites-leagues`)
        .set('Cookie', [`token=${makeToken(user.id)}`]);

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0]).toMatchObject({ id: 10, name: 'Ligue 1' });
    });

    it("retourne 403 si l'utilisateur lit les favoris d'un autre compte", async () => {
      const user = await prisma.user.create({
        data: {
          username: 'testuser',
          email: 'test@test.com',
          password: 'hashed',
        },
      });
      const otherUser = await prisma.user.create({
        data: {
          username: 'otheruser',
          email: 'other@test.com',
          password: 'hashed',
        },
      });
      await prisma.competitions.create({
        data: { id: 10, name: 'Ligue 1', type: 'league', category: 1 },
      });
      await prisma.userFavorite.create({
        data: { user_id: otherUser.id, competition_id: 10 },
      });

      const response = await request(app)
        .get(`/protected/users/${otherUser.id}/favorites-leagues`)
        .set('Cookie', [`token=${makeToken(user.id)}`]);

      expect(response.status).toBe(403);
      expect(response.body).toEqual({ error: 'Action non autorisée' });
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

    it('returns 200 when the competition is already a favorite', async () => {
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
        .post('/protected/users/favorites-leagues')
        .set('Cookie', [`token=${makeToken(user.id)}`])
        .send({ leagueId: 10 });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        message: 'La compétition est déjà dans les favoris.',
      });
    });

    it("retourne 404 si la compétition n'existe pas", async () => {
      const user = await prisma.user.create({
        data: {
          username: 'testuser',
          email: 'test@test.com',
          password: 'hashed',
        },
      });

      const response = await request(app)
        .post('/protected/users/favorites-leagues')
        .set('Cookie', [`token=${makeToken(user.id)}`])
        .send({ leagueId: 999 });

      expect(response.status).toBe(404);
      expect(response.body).toMatchObject({
        error: 'Compétition introuvable.',
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

    it("retourne 404 si la compétition n'est pas dans les favoris", async () => {
      const user = await prisma.user.create({
        data: {
          username: 'testuser',
          email: 'test@test.com',
          password: 'hashed',
        },
      });

      const response = await request(app)
        .delete('/protected/users/favorites-leagues/999')
        .set('Cookie', [`token=${makeToken(user.id)}`]);

      expect(response.status).toBe(404);
      expect(response.body).toMatchObject({
        error: "Cette compétition n'existe pas dans les favoris.",
      });
    });
  });

  describe('Validation des entrées', () => {
    it.each<[string, unknown]>([
      ['un clubId null', { clubId: null }],
      ['un clubId en chaîne', { clubId: '10' }],
    ])('POST favorites retourne 400 pour %s', async (_label, body) => {
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
        .send(body as object);

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'Identifiant invalide.' });
    });

    it('POST favorites-leagues retourne 400 pour un leagueId null', async () => {
      const user = await prisma.user.create({
        data: {
          username: 'testuser',
          email: 'test@test.com',
          password: 'hashed',
        },
      });

      const response = await request(app)
        .post('/protected/users/favorites-leagues')
        .set('Cookie', [`token=${makeToken(user.id)}`])
        .send({ leagueId: null });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'Identifiant invalide.' });
    });

    it("DELETE favorites retourne 400 si l'id n'est pas numérique", async () => {
      const user = await prisma.user.create({
        data: {
          username: 'testuser',
          email: 'test@test.com',
          password: 'hashed',
        },
      });

      const response = await request(app)
        .delete('/protected/users/favorites/abc')
        .set('Cookie', [`token=${makeToken(user.id)}`]);

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'Identifiant invalide.' });
    });
  });
});

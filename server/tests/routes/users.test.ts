import request from 'supertest';
import jwt from 'jsonwebtoken';
import { app } from '../../app';
import prisma from '../../lib/prisma';
import { resetDb } from '../setup/resetDb';

const VALID_PASSWORD = 'Password1!';
const SECRET_KEY = 'test-secret-key';

describe('Users routes', () => {
  beforeEach(async () => {
    await resetDb();
  });

  describe('POST /register', () => {
    it('retourne 400 si un champ est manquant', async () => {
      const response = await request(app).post('/register').send({
        username: 'testuser',
        mail: 'test@test.com',
        password: VALID_PASSWORD,
      });

      expect(response.status).toBe(400);
      expect(response.body).toMatchObject({
        error: 'Tous les champs sont obligatoires',
      });
    });

    it('retourne 400 si les mots de passe ne correspondent pas', async () => {
      const response = await request(app).post('/register').send({
        username: 'testuser',
        mail: 'test@test.com',
        password: VALID_PASSWORD,
        confirmPassword: 'Different1!',
      });

      expect(response.status).toBe(400);
      expect(response.body).toMatchObject({
        error: 'Les mots de passe ne correspondent pas',
      });
    });

    it('retourne 400 si le mot de passe est invalide', async () => {
      const response = await request(app).post('/register').send({
        username: 'testuser',
        mail: 'test@test.com',
        password: 'short',
        confirmPassword: 'short',
      });

      expect(response.status).toBe(400);
    });

    it('retourne 201 si inscription réussie', async () => {
      const response = await request(app).post('/register').send({
        username: 'testuser',
        mail: 'test@test.com',
        password: VALID_PASSWORD,
        confirmPassword: VALID_PASSWORD,
      });

      expect(response.status).toBe(201);
      expect(response.body).toMatchObject({ message: 'Inscription réussie.' });
    });
  });

  describe('POST /login', () => {
    it('retourne 400 si un champ est manquant', async () => {
      const response = await request(app)
        .post('/login')
        .send({ mail: 'test@test.com' });

      expect(response.status).toBe(400);
    });

    it('retourne 401 si le mot de passe est incorrect', async () => {
      await request(app).post('/register').send({
        username: 'testuser',
        mail: 'test@test.com',
        password: VALID_PASSWORD,
        confirmPassword: VALID_PASSWORD,
      });

      const response = await request(app)
        .post('/login')
        .send({ mail: 'test@test.com', password: 'WrongPassword1!' });

      expect(response.status).toBe(401);
    });

    it('retourne 200 et un cookie token si connexion réussie', async () => {
      await request(app).post('/register').send({
        username: 'testuser',
        mail: 'test@test.com',
        password: VALID_PASSWORD,
        confirmPassword: VALID_PASSWORD,
      });

      const response = await request(app)
        .post('/login')
        .send({ mail: 'test@test.com', password: VALID_PASSWORD });

      expect(response.status).toBe(200);
      expect(response.headers['set-cookie']).toBeDefined();
    });
  });

  describe('POST /logout', () => {
    it('retourne 200 même sans token', async () => {
      const response = await request(app).post('/logout');

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({ message: 'Déconnexion réussie' });
    });
  });

  describe('GET /user/profile', () => {
    it('retourne 401 sans token', async () => {
      const response = await request(app).get('/user/profile');

      expect(response.status).toBe(401);
    });

    it('retourne 200 et les données user avec un token valide', async () => {
      const user = await prisma.user.create({
        data: {
          username: 'testuser',
          email: 'test@test.com',
          password: 'hashed',
        },
      });

      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          username: user.username,
          createdAt: user.createdAt,
        },
        SECRET_KEY
      );

      const response = await request(app)
        .get('/user/profile')
        .set('Cookie', [`token=${token}`]);

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        isAuthenticated: true,
        user: { username: 'testuser' },
      });
    });
  });

  describe('DELETE /users/:id', () => {
    it('retourne 401 sans token', async () => {
      const response = await request(app).delete('/users/1');

      expect(response.status).toBe(401);
    });

    it("retourne 403 si l'id dans l'URL ne correspond pas au token", async () => {
      const user = await prisma.user.create({
        data: {
          username: 'testuser',
          email: 'test@test.com',
          password: 'hashed',
        },
      });

      const token = jwt.sign(
        {
          id: user.id + 999,
          email: 'other@test.com',
          username: 'other',
          createdAt: new Date(),
        },
        SECRET_KEY
      );

      const response = await request(app)
        .delete(`/users/${user.id}`)
        .set('Cookie', [`token=${token}`]);

      expect(response.status).toBe(403);
    });

    it('retourne 200 si utilisateur supprime son propre compte', async () => {
      const user = await prisma.user.create({
        data: {
          username: 'testuser',
          email: 'test@test.com',
          password: 'hashed',
        },
      });

      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          username: user.username,
          createdAt: user.createdAt,
        },
        SECRET_KEY
      );

      const response = await request(app)
        .delete(`/users/${user.id}`)
        .set('Cookie', [`token=${token}`]);

      expect(response.status).toBe(200);
    });
  });
});

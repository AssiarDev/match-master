import request from 'supertest';
import jwt from 'jsonwebtoken';
import { app } from '../../app';
import prisma from '../../lib/prisma';
import { resetDb } from '../setup/resetDb';
import { isBlacklisted } from '../../lib/tokenBlacklist';

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

    it("n'inclut pas l'email dans le token", async () => {
      await request(app).post('/register').send({
        username: 'testuser',
        mail: 'test@test.com',
        password: VALID_PASSWORD,
        confirmPassword: VALID_PASSWORD,
      });

      const response = await request(app)
        .post('/login')
        .send({ mail: 'test@test.com', password: VALID_PASSWORD });

      const cookies = response.headers['set-cookie'] as unknown as string[];
      const tokenCookie = cookies.find((c) => c.startsWith('token='))!;
      const token = tokenCookie.split(';')[0].slice('token='.length);
      const decoded = jwt.decode(token) as jwt.JwtPayload;

      expect(decoded).toHaveProperty('id');
      expect(decoded).not.toHaveProperty('email');
    });
  });

  describe('POST /logout', () => {
    it('retourne 200 même sans token', async () => {
      const response = await request(app).post('/logout');

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({ message: 'Déconnexion réussie' });
    });

    it('refuse le token sur les routes protégées après la déconnexion', async () => {
      const user = await prisma.user.create({
        data: {
          username: 'testuser',
          email: 'test@test.com',
          password: 'hashed',
        },
      });
      const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: '1h' });

      await request(app)
        .post('/logout')
        .set('Cookie', [`token=${token}`]);
      const response = await request(app)
        .get('/user/profile')
        .set('Cookie', [`token=${token}`]);

      expect(response.status).toBe(401);
      expect(response.body).toMatchObject({ error: 'Token invalide' });
    });

    it("n'ajoute pas un token invalide à la blacklist", async () => {
      const response = await request(app)
        .post('/logout')
        .set('Cookie', ['token=forged-token']);

      expect(response.status).toBe(200);
      expect(isBlacklisted('forged-token')).toEqual(false);
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
        user: { username: 'testuser', mail: 'test@test.com' },
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

  describe('GET /users', () => {
    it("retourne 404 car la route n'est pas exposée", async () => {
      const response = await request(app).get('/users');

      expect(response.status).toBe(404);
    });
  });

  describe('PUT /users/:id', () => {
    it('ne renvoie pas le mot de passe après mise à jour', async () => {
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
          username: user.username,
          createdAt: user.createdAt,
        },
        SECRET_KEY
      );

      const response = await request(app)
        .put(`/users/${user.id}`)
        .set('Cookie', [`token=${token}`])
        .send({ username: 'newname' });

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({ username: 'newname' });
      expect(response.body).not.toHaveProperty('password');
    });

    it('émet un nouveau token qui expire après 1h', async () => {
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
          username: user.username,
          createdAt: user.createdAt,
        },
        SECRET_KEY
      );

      const response = await request(app)
        .put(`/users/${user.id}`)
        .set('Cookie', [`token=${token}`])
        .send({ username: 'newname' });

      const cookies = response.headers['set-cookie'] as unknown as string[];
      const tokenCookie = cookies.find((c) => c.startsWith('token='))!;
      const newToken = tokenCookie.split(';')[0].slice('token='.length);
      const decoded = jwt.decode(newToken) as jwt.JwtPayload;

      expect(response.status).toBe(200);
      expect(decoded.exp! - decoded.iat!).toBe(3600);
      expect(tokenCookie).toContain('Max-Age=3600;');
    });
  });

  describe('Codes HTTP des erreurs métier', () => {
    /** Registers a user through the route, so the password is really hashed. */
    const registerUser = async () => {
      await request(app).post('/register').send({
        username: 'testuser',
        mail: 'test@test.com',
        password: VALID_PASSWORD,
        confirmPassword: VALID_PASSWORD,
      });
      const user = await prisma.user.findUniqueOrThrow({
        where: { email: 'test@test.com' },
      });
      const token = jwt.sign(
        { id: user.id, username: user.username, createdAt: user.createdAt },
        SECRET_KEY,
        { expiresIn: '1h' }
      );
      return { user, token };
    };

    it("POST /register retourne 409 si l'email est déjà utilisé", async () => {
      await registerUser();

      const response = await request(app).post('/register').send({
        username: 'other',
        mail: 'test@test.com',
        password: VALID_PASSWORD,
        confirmPassword: VALID_PASSWORD,
      });

      expect(response.status).toBe(409);
      expect(response.body).toEqual({ error: 'Email déjà utilisé.' });
    });

    it('POST /login répond pareil pour un email inconnu et un mauvais mot de passe', async () => {
      await registerUser();

      const unknownEmail = await request(app)
        .post('/login')
        .send({ mail: 'inconnu@test.com', password: VALID_PASSWORD });
      const wrongPassword = await request(app)
        .post('/login')
        .send({ mail: 'test@test.com', password: 'WrongPassword1!' });

      expect(unknownEmail.status).toBe(401);
      expect(wrongPassword.status).toBe(401);
      expect(unknownEmail.body).toEqual(wrongPassword.body);
    });

    it('PUT /users/:id retourne 401 si le mot de passe actuel est incorrect', async () => {
      const { user, token } = await registerUser();

      const response = await request(app)
        .put(`/users/${user.id}`)
        .set('Cookie', [`token=${token}`])
        .send({
          currentPassword: 'WrongPassword1!',
          newPassword: 'NewPassword1!',
          confirmPassword: 'NewPassword1!',
        });

      expect(response.status).toBe(401);
      expect(response.body).toEqual({ error: 'Mot de passe actuel incorrect' });
    });

    it("PUT /users/:id retourne 400 si l'id n'est pas numérique", async () => {
      const { token } = await registerUser();

      const response = await request(app)
        .put('/users/abc')
        .set('Cookie', [`token=${token}`])
        .send({ username: 'newname' });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'Identifiant invalide.' });
    });
  });
});

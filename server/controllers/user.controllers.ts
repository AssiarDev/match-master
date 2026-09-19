import type { Request, Response } from 'express';
import { userService } from '../lib/container';
import { addToBlacklist } from '../lib/tokenBlacklist';
import { endSession, startSession, verifyToken } from '../lib/session';
import { sendServiceError } from '../utils/sendServiceError';

export const register = async (req: Request, res: Response): Promise<void> => {
  const { username, mail, password, confirmPassword } = req.body;

  if (!username || !mail || !password || !confirmPassword) {
    res.status(400).json({ error: 'Tous les champs sont obligatoires' });
    return;
  }

  if (password !== confirmPassword) {
    res.status(400).json({ error: 'Les mots de passe ne correspondent pas' });
    return;
  }

  const result = await userService.register(username, mail, password);
  if (!result.success) return sendServiceError(res, result);

  res.status(201).json({ message: 'Inscription réussie.' });
};

/**
 * Logs the user in and sets the auth cookie.
 * A failed login does not go through sendServiceError: the service message
 * tells an unknown email apart from a wrong password, which would let anyone
 * find out which emails have an account. The client always gets the same
 * generic message.
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  const { mail, password } = req.body;
  if (!mail || !password) {
    res.status(400).json({ error: 'Tous les champs sont obligatoires' });
    return;
  }
  const result = await userService.login(mail, password);
  if (!result.success) {
    res.status(401).json({ error: 'Identifiant ou mot de passe incorrect.' });
    return;
  }

  startSession(res, {
    id: result.id,
    username: result.username,
    createdAt: result.createdAt,
  });
  res.status(200).json({ message: 'Connexion reussie' });
};

/**
 * Logs the user out: revokes the token and clears the cookie.
 * Only a valid token is revoked: its exp bounds how long it stays in the
 * blacklist, and an invented cookie value never gets in. An invalid or
 * already expired token has nothing to revoke, so the error is ignored.
 */
export const logout = (req: Request, res: Response): void => {
  const token = req.cookies.token;
  if (token) {
    try {
      const { exp } = verifyToken(token);
      if (exp) addToBlacklist(token, exp);
    } catch {}
  }

  endSession(res);
  res.status(200).json({ message: 'Déconnexion réussie' });
};

export const getUsers = async (req: Request, res: Response): Promise<void> => {
  const result = await userService.getAllUsers();
  if (!result.success) return sendServiceError(res, result);
  res.json(result.users);
};

export const deleteUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const id = Number(req.params.id);
  const result = await userService.deleteUser(id);
  if (!result.success) return sendServiceError(res, result);
  res.json({ message: result.message });
};

export const updateUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const id = Number(req.params.id);
  const { username, confirmPassword, newPassword, currentPassword } = req.body;

  if ((newPassword || confirmPassword) && newPassword !== confirmPassword) {
    res.status(400).json({ error: 'Les mots de passe ne correspondent pas' });
    return;
  }

  if (!username && !newPassword) {
    res.status(400).json({ error: 'Aucun champ à mettre à jour' });
    return;
  }

  const result = await userService.updateUser(id, {
    username,
    password: newPassword,
    currentPassword,
  });
  if (!result.success) return sendServiceError(res, result);

  startSession(res, {
    id: result.user.id,
    username: result.user.username,
    createdAt: result.user.createdAt.toLocaleDateString('FR-fr'),
  });
  res.json(result.user);
};

export const userProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  if (!req.user) {
    res
      .status(401)
      .json({ isAuthenticated: false, message: 'Non authentifié' });
    return;
  }
  const result = await userService.getUserById(req.user.id);
  if (!result.success) return sendServiceError(res, result);
  res.json({
    isAuthenticated: true,
    user: {
      id: req.user.id,
      mail: result.user.email,
      username: req.user.username,
      createdAt: req.user.createdAt,
    },
  });
};

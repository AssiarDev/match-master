import type { Request, Response } from 'express';
import { userService } from '../lib/container';
import { addToBlacklist } from '../lib/tokenBlacklist';
import { endSession, startSession, verifyToken } from '../lib/session';
import { sendServiceError } from '../utils/sendServiceError';
import { MESSAGES } from '../constants/messages';

export const register = async (req: Request, res: Response): Promise<void> => {
  const { username, mail, password, confirmPassword } = req.body;

  if (!username || !mail || !password || !confirmPassword) {
    res.status(400).json({ error: MESSAGES.common.missingFields });
    return;
  }

  if (password !== confirmPassword) {
    res.status(400).json({ error: MESSAGES.user.passwordsMismatch });
    return;
  }

  const result = await userService.register(username, mail, password);
  if (!result.success) return sendServiceError(res, result);

  res.status(201).json({ message: MESSAGES.auth.registered });
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
    res.status(400).json({ error: MESSAGES.common.missingFields });
    return;
  }
  const result = await userService.login(mail, password);
  if (!result.success) {
    res.status(401).json({ error: MESSAGES.auth.invalidCredentials });
    return;
  }

  startSession(res, {
    id: result.id,
    username: result.username,
    createdAt: result.createdAt,
  });
  res.status(200).json({ message: MESSAGES.auth.loggedIn });
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
  res.status(200).json({ message: MESSAGES.auth.loggedOut });
};

/**
 * Lists every user. Not routed: its public route `GET /users` exposed every
 * user's email and was disabled by fix #21 (see routes/users.ts).
 * Kept on purpose (decision traced in ADR-16) for a future admin view; it
 * must only be routed again behind authentication and an admin check.
 */
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
    res.status(400).json({ error: MESSAGES.user.passwordsMismatch });
    return;
  }

  if (!username && !newPassword) {
    res.status(400).json({ error: MESSAGES.user.nothingToUpdate });
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
    res.status(401).json({
      isAuthenticated: false,
      message: MESSAGES.auth.notAuthenticated,
    });
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

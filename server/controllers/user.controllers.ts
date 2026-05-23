import type { Request, Response } from 'express';
import { userService } from '../lib/container';
import jwt from 'jsonwebtoken';
import { addToBlacklist } from '../lib/tokenBlacklist';
import { validatePassword } from '../utils/validatePassword';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, mail, password, confirmPassword } = req.body;

    if (!username || !mail || !password || !confirmPassword) {
      res.status(400).json({ error: 'Tous les champs sont obligatoires' });
      return;
    }

    if (password !== confirmPassword) {
      res.status(400).json({ error: 'Les mots de passe ne correspondent pas' });
      return;
    }

    const validPassword = validatePassword(password);
    if (validPassword) {
      res.status(400).json({ error: validPassword });
      return;
    }

    const result = await userService.register(username, mail, password);
    if (!result.success) {
      res.status(400).json({ error: result.message });
      return;
    }

    res.status(201).json({ message: 'Inscription réussie.' });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { mail, password } = req.body;
    if (!mail || !password) {
      res.status(400).json({ error: 'Tous les champs sont obligatoire' });
      return;
    }
    const result = await userService.login(mail, password);
    if (!result.success) {
      res.status(401).json({ error: 'Identifiants incorrects.' });
      return;
    }

    const token = jwt.sign(
      {
        id: result.id,
        email: result.email,
        username: result.username,
        createdAt: result.createdAt,
      },
      process.env.SECRET_KEY!,
      { expiresIn: '1h' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 36000000,
    });
    res.status(200).json({ message: 'Connexion reussie' });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

export const logout = (req: Request, res: Response): void => {
  const token = req.cookies.token;
  if (token) addToBlacklist(token);

  res.clearCookie('token', {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    path: '/',
  });
  res.status(200).json({ message: 'Déconnexion réussie' });
};

export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await userService.getAllUsers();
    if (!users) {
      res
        .status(500)
        .json({ error: 'Impossible de récupérer tous les utilisateurs' });
      return;
    }
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

export const deleteUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ error: 'ID invalide' });
      return;
    }
    if (req.user!.id !== id) {
      res.status(403).json({ error: 'Action non autorisée' });
      return;
    }
    const result = await userService.deleteUser(id);
    if (result.success) {
      res.json({ message: result.message });
    } else {
      res.status(404).json({ error: result.message });
    }
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

export const updateUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ error: 'ID invalide' });
      return;
    }
    if (req.user!.id !== id) {
      res.status(403).json({ error: 'Action non autorisée' });
      return;
    }
    const { username, confirmPassword, newPassword, currentPassword } =
      req.body;

    if (newPassword || confirmPassword) {
      if (!currentPassword) {
        res.status(400).json({ message: 'Le mot de passe est incorrecte.' });
        return;
      }

      if (newPassword !== confirmPassword) {
        res
          .status(400)
          .json({ message: 'Les mots de passe ne correspondent pas' });
        return;
      }

      const validPassword = validatePassword(newPassword);
      if (validPassword) {
        res.status(400).json({ error: validPassword });
        return;
      }
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
    if (!result.success) {
      res.status(404).json({ error: result.message });
      return;
    }

    const newToken = jwt.sign(
      {
        id: result.user.id,
        email: result.user.email,
        username: result.user.username,
        createdAt: result.user.createdAt.toLocaleDateString('FR-fr'),
      },
      process.env.SECRET_KEY as string
    );

    res.cookie('token', newToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 36000000,
    });

    res.json(result.user);
  } catch (err) {
    console.error('updateUser error:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

export const userProfile = (req: Request, res: Response): void => {
  if (!req.user) {
    res
      .status(401)
      .json({ isAuthenticated: false, message: 'Non authentifié' });
    return;
  }
  res.json({
    isAuthenticated: true,
    user: {
      id: req.user.id,
      mail: req.user.email,
      username: req.user.username,
      createdAt: req.user.createdAt,
    },
  });
};

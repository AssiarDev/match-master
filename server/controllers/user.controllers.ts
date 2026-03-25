import type { Request, Response } from 'express';
import { UserService } from '../service/userService';

const userService = new UserService();

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
    const result = await userService.register(username, mail, password);
    res.json(result.success);
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
    if (result.success) {
      req.session.user = { id: result.id, email: result.email };
      res.cookie('token', result.token, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 36000000,
      });
      res.status(200).json({ message: 'Connexion reussie' });
    } else {
      res.status(401).json({ error: 'Identifiants incorrects.' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

export const logout = (req: Request, res: Response): void => {
  res.clearCookie('token', {
    secure: true,
    sameSite: true,
    maxAge: 0,
    path: '/',
  });
  res.status(200).json({ message: 'Déconnexion réussie' });
};

export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await userService.getAllUsers();
    if (!users) {
      res.status(500).json({ error: 'Impossible de récupérer tous les utilisateurs' });
      return;
    }
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: 'ID invalide' });
      return;
    }
    const result = await userService.deleteUser(id);
    if (result) {
      res.json({ message: 'Utilisateur supprimé avec succès' });
    } else {
      res.status(404).json({ error: 'Utilisateur introuvable' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

export const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    const { username, email } = req.body;
    if (!username || !email) {
      res.status(400).json({ error: 'Tous les champs sont obligatoires' });
      return;
    }
    const result = await userService.updateUser(id, { username, email });
    if (!result) {
      res.status(404).json({ error: 'Erreur lors de la mise à jour' });
      return;
    }
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

export const userProfile = (req: Request, res: Response): void => {
  if (!req.user) {
    res.status(401).json({ isAuthenticated: false, message: 'Non authentifié' });
    return;
  }
  res.json({
    isAuthenticated: true,
    user: {
      id: req.user.id,
      mail: req.user.email,
      username: req.user.username,
    },
  });
};

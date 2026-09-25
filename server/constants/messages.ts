/**
 * Every message sent to the client, in one place: a wording is fixed once,
 * and the same situation always gets the same message.
 * Grouped by domain. Messages only written to the logs do not belong here.
 */
export const MESSAGES = {
  common: {
    invalidId: 'Identifiant invalide.',
    invalidRequest: 'Requête invalide.',
    routeNotFound: 'Route introuvable.',
    serverError: 'Erreur serveur',
    forbidden: 'Action non autorisée',
    missingFields: 'Tous les champs sont obligatoires',
  },
  auth: {
    registered: 'Inscription réussie.',
    invalidCredentials: 'Identifiant ou mot de passe incorrect.',
    loggedIn: 'Connexion réussie',
    loggedOut: 'Déconnexion réussie',
    notAuthenticated: 'Non authentifié',
    tokenMissing: 'Accès refusé. Token absent.',
    tokenRevoked: 'Token invalide',
    tokenInvalid: 'Token invalide ou expiré.',
  },
  user: {
    notFound: 'Utilisateur introuvable.',
    emailTaken: 'Email déjà utilisé.',
    wrongPassword: 'Mot de passe incorrect.',
    passwordsMismatch: 'Les mots de passe ne correspondent pas',
    currentPasswordRequired: 'Mot de passe actuel requis',
    currentPasswordWrong: 'Mot de passe actuel incorrect',
    nothingToUpdate: 'Aucun champ à mettre à jour',
    deleted: 'Votre compte a bien été supprimé',
  },
  password: {
    tooShort: 'Minimum 8 caractères',
    missingUppercase: 'Minimum une majuscule requise',
    missingDigit: 'Minimum un chiffre requis',
    missingSpecial: 'Minimum un caractère spécial requis',
  },
  league: {
    notFound: 'Compétition introuvable.',
    noCurrentSeason: 'Aucune saison en cours pour cette compétition.',
  },
  team: {
    notFound: 'Équipe introuvable.',
  },
  matches: {
    dateRequired: 'La date est obligatoire',
  },
  favorites: {
    team: {
      alreadyAdded: 'Équipe déjà dans les favoris.',
      added: 'Favori ajouté.',
      notInFavorites: "Ce favori n'existe pas.",
      removed: 'Favori supprimé.',
    },
    competition: {
      alreadyAdded: 'La compétition est déjà dans les favoris.',
      added: 'La compétition a bien été ajoutée.',
      notInFavorites: "Cette compétition n'existe pas dans les favoris.",
      removed: 'La compétition a bien été supprimée de vos favoris.',
    },
  },
} as const;

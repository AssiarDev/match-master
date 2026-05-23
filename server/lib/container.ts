import { UserRepository } from '../repositories/user.repository';
import { UserFavoritesRepository } from '../repositories/userFavorites.repository';
import { TeamDBRepository } from '../repositories/teamDB.repository';
import { LeagueApiRepository } from '../repositories/leagueApi.repository';
import { LeagueDBRepository } from '../repositories/leagueDB.repository';
import { SeasonRepository } from '../repositories/season.repository';
import { MatchesRepository } from '../repositories/matches.repository';
import { ScorersRepository } from '../repositories/scorers.repository';
import { StandingRepository } from '../repositories/standings.repository';
import { PlayersRepository } from '../repositories/players.repository';

import { UserService } from '../service/userService';
import { TeamService } from '../service/teamService';
import { LeagueService } from '../service/leagueService';
import { SeasonService } from '../service/seasonService';
import { MatchesService } from '../service/matchesService';
import { ScorersService } from '../service/scorersService';
import { StandingService } from '../service/standingService';
import { FavoriteService } from '../service/favoriteService';

import { LiveMatchesBroadcaster } from '../sse/liveMatchesBroadcaster';

// Repositories
const userRepository = new UserRepository();
const userFavoritesRepository = new UserFavoritesRepository();
const teamDBRepository = new TeamDBRepository();
const leagueApiRepository = new LeagueApiRepository();
const leagueDBRepository = new LeagueDBRepository();
const seasonRepository = new SeasonRepository();
const matchesRepository = new MatchesRepository();
const scorersRepository = new ScorersRepository();
const standingRepository = new StandingRepository();
const playersRepository = new PlayersRepository();

// Services
export const userService = new UserService(userRepository);
export const leagueService = new LeagueService(
  leagueApiRepository,
  leagueDBRepository
);
export const seasonService = new SeasonService(seasonRepository);
export const teamService = new TeamService(
  teamDBRepository,
  leagueApiRepository,
  seasonRepository
);
export const matchesService = new MatchesService(
  matchesRepository,
  leagueService,
  seasonService
);
export const scorersService = new ScorersService(
  scorersRepository,
  leagueService,
  playersRepository
);
export const standingService = new StandingService(
  standingRepository,
  teamService,
  leagueService
);
export const favoriteService = new FavoriteService(
  userRepository,
  teamDBRepository,
  userFavoritesRepository,
  leagueDBRepository
);

export const liveMatchesBroadcaster = new LiveMatchesBroadcaster(
  matchesService
);

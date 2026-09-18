import type { User } from '@prisma/client';
import type { Stats } from '../utils/mapDetails';

export interface ApiResponse<T = unknown> {
  data: T;
}

export type SafeUser = Omit<User, 'password'>;

/**
 * Business failures a service can report, so that a controller can pick the
 * matching HTTP status. Technical failures (database, external API) are not
 * part of the contract: services let them throw, up to the controller's catch.
 */
export type ServiceErrorReason =
  'NOT_FOUND' | 'CONFLICT' | 'INVALID_CREDENTIALS' | 'INVALID_INPUT';

export type ServiceSuccess<T extends object = Record<never, never>> = {
  success: true;
} & T;

/** A business failure, with the reason a controller maps to an HTTP status. */
export type ServiceError = {
  success: false;
  reason: ServiceErrorReason;
  message: string;
};

/** Return contract shared by every service. */
export type ServiceResult<T extends object = Record<never, never>> =
  ServiceSuccess<T> | ServiceError;

/**
 * Data shapes returned by the services, declared explicitly so that a change
 * in a repository query does not silently change a service's public contract.
 */
export interface TeamSummary {
  id: number;
  name: string;
  image_path: string | null;
}

export interface TeamDetails extends TeamSummary {
  country_id: number | null;
  venue_id: number | null;
  gender: string | null;
  short_code: string | null;
  founded: number | null;
  type: string | null;
  placeholder: boolean;
  last_played_at: Date | null;
}

export interface LeagueTeam {
  team: TeamDetails;
}

export interface League {
  id: number;
  country_id: number | null;
  name: string;
  active: boolean;
  short_code: string | null;
  image_path: string | null;
  type: string;
  sub_type: string | null;
  category: number;
  has_jerseys: boolean;
}

export type EnrichedStanding = ApiStanding &
  Stats & {
    team_name: string;
    team_image: string | null;
    team_id: number;
  };

export interface ApiLeague {
  id: number;
  country_id: number | null;
  name: string;
  short_code: string | null;
  image_path: string | null;
  type: string;
  sub_type: string | null;
  last_played_at: string | null;
  category: number;
  has_jerseys: boolean;
  seasons?: ApiSeason[];
  currentseason?: { id: number; starting_at: string | null };
}

export interface ApiSeason {
  id: number;
  sport_id: number | null;
  league_id: number | null;
  tie_breaker_rule_id: number | null;
  name: string | null;
  finished: boolean | null;
  pending: boolean | null;
  is_current: boolean | null;
  starting_at: string | null;
  ending_at: string | null;
  games_in_current_week: boolean | null;
  teams?: ApiTeam[];
}

export interface ApiTeam {
  id: number;
  country_id: number | null;
  venue_id: number | null;
  gender: string | null;
  name: string;
  short_code: string | null;
  image_path: string | null;
  founded: number | null;
  type: string | null;
  placeholder: boolean;
  last_played_at: string | null;
}

export enum ScoreDescription {
  CURRENT = 'CURRENT',
  FIRST_HALF = '1ST_HALF',
  SECOND_HALF = '2ND_HALF',
  SECOND_HALF_ONLY = '2ND_HALF_ONLY',
  EXTRA_TIME = 'EXTRA_TIME',
  EXTRA_TIME_ONLY = 'EXTRA_TIME_ONLY',
  PENALTIES = 'PENALTIES',
}

export enum MatchStateDeveloperName {
  NOT_STARTED = 'NS',
  INPLAY_FIRST_HALF = 'INPLAY_1ST_HALF',
  HALF_TIME = 'HT',
  INPLAY_SECOND_HALF = 'INPLAY_2ND_HALF',
  INPLAY_EXTRA_TIME = 'INPLAY_ET',
  EXTRA_TIME_BREAK = 'EXTRA_TIME_BREAK',
  INPLAY_PENALTIES = 'INPLAY_PENALTIES',
  PENALTIES_BREAK = 'PEN_BREAK',
  FULL_TIME = 'FT',
  AFTER_EXTRA_TIME = 'AET',
  FULL_TIME_PENALTIES = 'FT_PEN',
  POSTPONED = 'POSTPONED',
  CANCELLED = 'CANCELLED',
  ABANDONED = 'ABANDONED',
  SUSPENDED = 'SUSPENDED',
}

export interface ApiParticipant {
  id: number;
  sport_id: number;
  country_id: number | null;
  venue_id: number | null;
  gender: string | null;
  name: string;
  short_code: string | null;
  image_path: string | null;
  founded: number | null;
  type: string | null;
  placeholder: boolean;
  last_played_at: string | null;
  meta: {
    location: 'home' | 'away';
    winner: boolean;
    position: number | null;
  };
}

export interface ApiScore {
  id: number;
  fixture_id: number;
  type_id: number;
  participant_id: number;
  description: ScoreDescription;
  score: {
    goals: number;
    participant: 'home' | 'away';
  };
}

export interface ApiMatchState {
  id: number;
  name: string;
  short_name: string;
  developer_name: MatchStateDeveloperName;
}

export interface ApiPeriod {
  id: number;
  fixture_id: number;
  type_id: number;
  started: number | null;
  ended: number | null;
  ticking: boolean;
  minutes: number;
  seconds: number;
  counts_from: number;
  period_length: number;
  sort_order: number;
  time_added: number | null;
  description: string;
  has_timer: boolean;
}

export interface ApiMatch {
  id: number;
  league?: { name: string; image_path: string | null };
  participants?: ApiParticipant[];
  scores?: ApiScore[];
  state?: ApiMatchState;
  venue?: unknown;
}

export interface ApiLiveMatch {
  id: number;
  sport_id: number;
  league_id: number;
  season_id: number;
  stage_id: number;
  group_id: number | null;
  aggregate_id: number | null;
  round_id: number | null;
  state_id: number;
  venue_id: number | null;
  name: string | null;
  starting_at: string | null;
  starting_at_timestamp: number;
  result_info: string | null;
  leg: string;
  details: string | null;
  length: number | null;
  placeholder: boolean;
  has_odds: boolean;
  has_premium_odds: boolean;
  league?: { id: number; name: string; image_path: string | null };
  participants?: ApiParticipant[];
  scores?: ApiScore[];
  state?: ApiMatchState;
  periods?: ApiPeriod[];
}

export interface ApiScorer {
  player_id: number;
  participant_id: number;
  [key: string]: unknown;
}

export interface ApiStanding {
  participant_id: number;
  team_id: number;
  details: ApiStandingDetail[];
  [key: string]: unknown;
}

export interface ApiStandingDetail {
  type: { code: string };
  value: number;
}

export interface ApiPlayer {
  id: number;
  sport_id: number | null;
  country_id: number | null;
  nationality_id: number | null;
  city_id: number | null;
  position_id: number | null;
  detailed_position_id: number | null;
  type_id: number | null;
  common_name: string | null;
  firstname: string | null;
  lastname: string | null;
  name: string | null;
  display_name: string | null;
  image_path: string | null;
  height: number | null;
  weight: number | null;
  date_of_birth: string | null;
  gender: string | null;
}

export interface ApiSquad {
  id: number;
  player_id: number;
  team_id: number;
  position_id: number | null;
  has_values: boolean | null;
  jersey_number: number | null;
  player: ApiPlayer;
}

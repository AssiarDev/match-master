export interface ApiResponse<T = unknown> {
  data: T;
}

export type ServiceSuccess<T = unknown> = { success: true } & T;
export type ServiceError = { success: false; message: string };
export type ServiceResult<T = unknown> = ServiceSuccess<T> | ServiceError;

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
  currentseason?: { id: number };
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

export interface ApiMatch {
  id: number;
  league?: { name: string; image_path: string };
  participants?: unknown[];
  venue?: unknown;
  scores?: unknown[];
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

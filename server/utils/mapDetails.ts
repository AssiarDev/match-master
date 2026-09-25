export interface Detail {
  type: {
    code: string;
  };
  value: number;
}

export interface Stats {
  played?: number;
  won?: number;
  draw?: number;
  lost?: number;
  goals_for?: number;
  goals_against?: number;
  goal_diff: number;
}

/** The SportMonks detail codes kept in the standings, and their stat. */
const STAT_BY_CODE: Record<string, Exclude<keyof Stats, 'goal_diff'>> = {
  'overall-matches-played': 'played',
  'overall-won': 'won',
  'overall-draw': 'draw',
  'overall-lost': 'lost',
  'overall-goals-for': 'goals_for',
  'overall-goals-against': 'goals_against',
};

/**
 * Turns the details of a SportMonks standing into named stats, and computes
 * the goal difference. Unknown codes are ignored.
 * @param details - The details of one standing row
 * @returns The stats found, with goal_diff always set
 */
export const mapDetails = (details: Detail[]): Stats => {
  const stats: Stats = { goal_diff: 0 };

  for (const detail of details) {
    const stat = STAT_BY_CODE[detail.type.code];
    if (stat) stats[stat] = detail.value;
  }

  stats.goal_diff = (stats.goals_for ?? 0) - (stats.goals_against ?? 0);
  return stats;
};

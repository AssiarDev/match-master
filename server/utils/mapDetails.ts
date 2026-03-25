export interface Detail {
  type: {
    code: string;
  };
  value: number | string;
}

export interface Stats {
  played?: number | string;
  won?: number | string;
  draw?: number | string;
  lost?: number | string;
  goals_for?: number | string;
  goals_against?: number | string;
  goal_diff?: number;
}

export const mapDetails = (details: Detail[]): Stats => {
  const stats: Stats = {};

  details.forEach((d) => {
    switch (d.type.code) {
      case "overall-matches-played": stats.played = d.value; break;
      case "overall-won": stats.won = d.value; break;
      case "overall-draw": stats.draw = d.value; break;
      case "overall-lost": stats.lost = d.value; break;
      case "overall-goals-for": stats.goals_for = d.value; break;
      case "overall-goals-against": stats.goals_against = d.value; break;
      default: break;
    }
  });

  stats.goal_diff = (Number(stats.goals_for) || 0) - (Number(stats.goals_against) || 0);

  return stats;
};

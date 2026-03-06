export const mapDetails = (details) => {
  const stats = {};

  details.forEach(d => {
    switch (d.type.code) {
      case "overall-matches-played":
        stats.played = d.value;
        break;
      case "overall-won":
        stats.won = d.value;
        break;
      case "overall-draw":
        stats.draw = d.value;
        break;
      case "overall-lost":
        stats.lost = d.value;
        break;
      case "overall-goals-for":
        stats.goals_for = d.value;
        break;
      case "overall-goals-against":
        stats.goals_against = d.value;
        break;
      default:
        break;
    }
  });

  // Calcul automatique si besoin
  stats.goal_diff = (stats.goals_for ?? 0) - (stats.goals_against ?? 0);

  return stats;
};
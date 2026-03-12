import { getLeagueCurrentSeason } from './leagues.js';
import { getPlayersByIds } from '../database/playersService.js';
import { urlAPI, token } from '../../config.js';

export const topScorers = async (id) => {
  try {
    const url = `${urlAPI}/topscorers/seasons/${id}?api_token=${token}&filters=seasonTopscorerTypes:208`;
    const response = await fetch(url);

    if (!response.ok) {
      console.error("API Topscorers error:", response.status);
      return []
    }

    const result = await response.json()
    const scorers = result?.data || [];

    return scorers;
  } catch (e) {
    console.error('Erreur impossible de récupérer les données :', e.message);
    return []
  }
};

export const getTopScorersFixtures = async (leagueId) => {
  const seasonId = await getLeagueCurrentSeason(leagueId);
  const scorers = await topScorers(seasonId);

  const playerIds = scorers.map(s => s.player_id);
  const players = await getPlayersByIds(playerIds);

  const playersMap = Object.fromEntries(
    players.map(p => [p.id, p])
  );

  const enriched = scorers.map(s => {
    const player = playersMap[s.player_id];

    return {
      ...s,
      player_name: player?.display_name || `Joueur #${s.player_id}`,
      player_image: player?.image_path || null,
      team_id: s.participant_id
    };
  });

  return enriched;

}
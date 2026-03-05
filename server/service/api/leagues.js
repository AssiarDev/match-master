import { urlAPI, requestOption, token } from './config.js';

export const fetchAllLeagues = async () => {
  try {
    const url = `${urlAPI}/leagues?api_token=${token}`;
    const response = await fetch(url);
    if (!response.ok) {
      console.log('Error, api failed');
      throw new Error('Error, api failed');
    }
    const result = await response.json();

    return result;
  } catch (error) {
    console.error("Erreur lors de l'appel de l'API", error);
  }
};

export const getLeagueSeasons = async (leagueId) => {
  try {
    const url = `${urlAPI}/leagues/${leagueId}?api_token=${token}&include=seasons`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Error api failed');
    }

    const result = await response.json();
    return result;
    
  } catch (error) {
    console.error("Erreur lors de l'appel API :", error);
    return null
  }
};

export const getLeague = async (leagueId) => {
  try {
    const url = `${urlAPI}/leagues/${leagueId}?api_token=${token}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Error api failed');
    }

    const result = await response.json();
    return result?.data;
    
  } catch (error) {
    console.error("Erreur lors de l'appel API :", error);
    return null
  }
};

export const getActiveSeasonId = async (leagueId) => {
  const result = await getLeagueSeasons(leagueId);
  const seasons = result?.data?.seasons;
  if (!seasons) return null;
  const current = seasons.find(s => s.is_current);
  if (!current) throw new Error("No active season found in seasons list");
  return current?.id;
};

export const getLeagueCurrentSeason = async (leagueId) => {
  const url = `${urlAPI}/leagues/${leagueId}?api_token=${token}&include=currentSeason.stages`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Error API : ${response.status}`);
  const json = await response.json();
  return json.data?.currentseason?.id;
};

export const getSeasonFixtures = async (seasonId) => {
  const url = `${urlAPI}/schedules/seasons/${seasonId}?api_token=${token}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Error API : ${response.status}`);
  const json = await response.json();
  return json.data ?? [];
};

export const getLeagueMatches = async (leagueId) => {
  const seasonId = await getLeagueCurrentSeason(leagueId);
  const fixtures = await getSeasonFixtures(seasonId);
  return fixtures;
};

export const getSeasonsTeams = async (seasonId) => {
  try {
    const url = `${urlAPI}/seasons/${seasonId}?api_token=${token}&include=teams`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Error API failed');
    }
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Erreur lors de l'appel API :", error);
  }
};

export const getTeamsForLeague = async (leagueId) => {
  const seasonData = await getLeagueSeasons(leagueId);
  const seasons = seasonData.data?.seasons ?? [];

  const activeSeason = seasons.find((s) => s.is_current === true);
  if (!activeSeason) return [];

  const teamsData = await getSeasonsTeams(activeSeason.id);
  return {
    season: activeSeason,
    teams: teamsData.data?.teams ?? [],
  };
};

export const getLeaguesWithSeasons = async (leagueId) => {
  try {
    const url = `${urlAPI}/leagues/${leagueId}?api_token=${token}&include=seasons`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Error API Failed');
    }
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error during API call', error);
  }
};

export const fetchChampionshipIds = async () => {
  try {
    const response = await fetch(`${urlAPI}/competitions`, requestOption);
    if (!response.ok) {
      throw new Error(`Erreur HTTP ${response.status}`);
    }

    const data = await response.json();

    if (!Array.isArray(data.competitions)) {
      console.error('Format inattendu : "competitions" n’est pas un tableau');
      return [];
    }

    return data.competitions.map((comp) => comp.id).filter(Boolean);
  } catch (error) {
    console.error(
      'Erreur lors de la récupération des IDs de compétitions :',
      error.message
    );
    return [];
  }
};

import { urlAPI, requestOption, token } from './config.js';

export const fetchCompetitionsMatches = async (leagueId) => {
  const url = `${urlAPI}/fixtures?api_token=${token}&filters=league_id:${leagueId};&include=participants;league;scores`;

  const response = await fetch(url, requestOption);

  if (!response.ok) {
    throw new Error(`SportMonks error: ${response.status}`);
  }

  const json = await response.json();
  return json.data || [];

};

export const fetchMatchesByCompetitions = async (teamsIds) => {
  try {
    if (!teamsIds || !Array.isArray(teamsIds)) {
      throw new Error(
        'Les IDs des compétitions doivent être fournis sous forme de tableau.'
      );
    }

    const urls = teamsIds.map((id) => `${urlAPI}/schedules/teams/${id}`)

    // Effectuer les requêtes en parallèle
    const responses = await Promise.all(
      urls.map((url) => fetch(url, requestOption))
    );

    const jsonResults = await Promise.all(
      responses.map((response) => response.json())
    );

    // Combiner les résultats
    const allMatches = jsonResults.flatMap((result) => result.data || []);
    console.log('all matches :', allMatches)

    return allMatches;
  } catch (error) {
    console.error('Erreur lors de la récupération des matchs :', error);
    return [];
  }
};

export const fetchMatchesByDate = async (date) => {
  const url = `${urlAPI}/fixtures/date/${date}?api_token=${token}&include=league;participants;venue;scores`;

  const response = await fetch(url, requestOption)
  const data = await response.json()

  const fixtures = data.data || []

  const grouped = fixtures.reduce((acc, match) => {
    const leagueName = match.league?.name || "unknown league"
    const flag = match.league?.image_path || ""

    if(!acc[leagueName]){
      acc[leagueName] = { flag, matches: [] }
    }

    acc[leagueName].matches.push(match)
    return acc
  }, {})

  return grouped
}

export const fetchMatchesByTeam = async (teamId) => {
  const url = `${urlAPI}/schedules/teams/${teamId}?api_token=${token}&include=league;participants;venue`;

  const response = await fetch(url, requestOption);

  const json = await response.json();

  return json.data || [];
};
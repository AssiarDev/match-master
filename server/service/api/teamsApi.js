import { urlAPI, requestOption } from './config.js';

export const fetchTeams = async () => {
  let url = `${urlAPI}/teams?page=1`;
  let allTeams = [];
  let hasMore = true;

  while (hasMore) {
    const response = await fetch(url, requestOption);
    const result = await response.json();

    allTeams.push(...result.data);

    hasMore = result.pagination?.has_more;
    url = result.pagination?.next_page;
  }
  return allTeams;
};

export const fetchSeasonTeams = async (seasonId) => {
  const url = `${urlAPI}/seasons/${seasonId}?include=teams`;
  const response = await fetch(url, requestOption);
  const result = await response.json();

  return result.data?.teams ?? [];
};

export const getTeamSquad = async (seasonId, teamId) => {
  const url = `${urlAPI}/squads/seasons/${seasonId}/teams/${teamId}?include=player`;
  const response = await fetch(url, requestOption);
  const result = await response.json();
  return result;
};

export const fetchPlayersForTeams = async (competitionIds) => {
  try {
    const allPlayers = [];

    const urls = competitionIds.map(
      (id) => `${urlAPI}/competitions/${id}/teams`
    );

    const responses = await Promise.all(
      urls.map((url) => fetch(url, requestOption))
    );

    const results = await Promise.all(
      responses.map((response) => {
        if (!response.ok) {
          console.log('Error, API failed');
          throw new Error('Error, API failed');
        }
        return response.json();
      })
    );

    results.forEach((result) => {
      if (result.teams && result.teams.length > 0) {
        result.teams.forEach((team) => {
          const clubId = team.id;

          if (team.squad && team.squad.length > 0) {
            const players = team.squad.map((player) => ({
              id: player.id,
              name: player.name,
              position: player.position,
              date_of_birth: player.dateOfBirth,
              nationality: player.nationality,
              id_club: clubId,
            }));

            console.log(`Joueurs pour l'équipe ${team.name}:`, players);
            allPlayers.push(...players);
          } else {
            console.log(
              `Pas de squad trouvé pour l'équipe ${team.name} (ID ${team.id}).`
            );
          }
        });
      } else {
        console.log('Aucune équipe trouvée dans les données du résultat.');
      }
    });

    return allPlayers;
  } catch (error) {
    console.error(
      "Erreur lors de l'appel de l'API pour récupérer les joueurs :",
      error.message
    );
    throw error;
  }
};

export const fetchTrainersForTeams = async (competitionIds) => {
  try {
    const allTrainers = [];

    const urls = competitionIds.map(
      (id) => `${urlAPI}/competitions/${id}/teams`
    );

    const responses = await Promise.all(
      urls.map((url) => fetch(url, requestOption))
    );

    const results = await Promise.all(
      responses.map((response) => {
        if (!response.ok) {
          console.log('Error, API failed');
          throw new Error('Error, API failed');
        }
        return response.json();
      })
    );

    results.forEach((result) => {
      if (result.teams && result.teams.length > 0) {
        result.teams.forEach((team) => {
          const clubId = team.id;

          if (team.coach) {
            const trainers = {
              id: team.coach.id,
              name: team.coach.name,
              date_of_birth: team.coach.dateOfBirth,
              nationality: team.coach.nationality,
              contract_start: team.coach.contract.start || 'Date inconnue',
              contract_end: team.coach.contract.until || 'Date inconnue',
              id_club: clubId,
            };

            console.log(`Entraineur pour l'équipe ${team.name}:`, trainers);
            allTrainers.push(trainers);
          } else {
            console.log(
              `Pas d'entraineur trouvé pour l'équipe ${team.name} (ID ${team.id}).`
            );
          }
        });
      } else {
        console.log('Aucune entraineur trouvé dans les données du résultat.');
      }
    });

    console.log('allTrainers: ', allTrainers);

    return allTrainers;
  } catch (error) {
    console.error(
      "Erreur lors de l'appel de l'API pour récupérer les entraineurs :",
      error.message
    );
    throw error;
  }
};

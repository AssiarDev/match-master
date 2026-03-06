import { urlAPI, requestOption } from './config.js';

export const fetchPlayer = async (playerId) => {
  const url = `${urlAPI}/players/${playerId}`;
  const response = await fetch(url, requestOption);
  const result = await response.json();

  const player = result.data;

  if (!player || typeof player !== 'object' || !player.id) {
    return null;
  }

  return player;
};

import checkpointService from "$lib/data/checkpoint-service";
import { json } from '@sveltejs/kit';
import { error } from '@sveltejs/kit';

export async function GET({ url }) {
  const raceId = url.searchParams.get('raceId');
  
  if (!raceId) {
    throw error(400, 'raceId is required');
  }

  const checkpoints = await checkpointService.getByRace(parseInt(raceId));
  return json(checkpoints);
}
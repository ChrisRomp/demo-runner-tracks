import { error } from '@sveltejs/kit';
import raceService from '$lib/data/race-service.js';
import { getPagination, getParsedPage } from '$lib/utils/pagination';

const pageSize = 10;

export async function load({ params, url }) {
  const raceId = parseInt(params.id, 10);
  const page = getParsedPage(url.searchParams.get('page'));

  const race = await raceService.getByIdWithPagedParticipants(raceId, page, pageSize);
  if (!race) {
    throw error(404, 'Race not found');
  }

  const pagination = getPagination(page, pageSize, race.participantCount);

  return {
    race,
    pagination
  };
}
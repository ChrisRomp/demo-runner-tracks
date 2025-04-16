import raceService from '$lib/data/race-service';
import { getPagination, getParsedPage } from '$lib/utils/pagination';

export async function load({ url }) {
  const currentPage = getParsedPage(url.searchParams.get('page'));

  const pageSize = 10;
  const { races, raceCount } = await raceService.getPaged(currentPage, pageSize);

  return {
    races,
    pagination: getPagination(currentPage, pageSize, raceCount)
  };
}

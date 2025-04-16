// tests for routes/+page.server.ts
// Does not test for 400 errors on invalid page input as that is handled by the getParsedPage function
import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { load } from './+page.server';
import { getParsedPage, getPagination } from '$lib/utils/pagination';
import raceService from '$lib/data/race-service';

vi.mock('$lib/utils/pagination');
vi.mock('$lib/data/race-service');

describe('load', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  function setupTestPage(page: number) {
    const pagination: any = { page };
    const races = [{id: 1}];
    const raceCount = 42;
    const pageSize = 10;

    vi.mocked(raceService.getPaged).mockResolvedValue({races, raceCount} as any);
    vi.mocked(getParsedPage).mockReturnValue(page);
    vi.mocked(getPagination).mockReturnValue(pagination);

    return {
      pagination,
      races,
      raceCount,
      pageSize
    }
  }

  it('should load first page by default', async () => {
    const defaultPageNumber = 1;
    const testUrl = new URL('http://localhost');
    const testData = setupTestPage(defaultPageNumber);

    const result = await load({ url: testUrl });

    expect(getParsedPage).toHaveBeenCalledWith(null); // null is the parameter for the default page number
    expect(getPagination).toHaveBeenCalledWith(defaultPageNumber, testData.pageSize, testData.raceCount);
    expect(raceService.getPaged).toHaveBeenCalledWith(defaultPageNumber, testData.pageSize);
    expect(result).toEqual({races: testData.races, pagination: testData.pagination});
  });

  it('should load provided page', async () => {
    const pageNumber = 2;
    const testUrl = new URL(`http://localhost?page=${pageNumber}`);
    const testData = setupTestPage(pageNumber);

    const result = await load({ url: testUrl });

    expect(getParsedPage).toHaveBeenCalledWith(pageNumber.toString());
    expect(getPagination).toHaveBeenCalledWith(pageNumber, testData.pageSize, testData.raceCount);
    expect(raceService.getPaged).toHaveBeenCalledWith(pageNumber, testData.pageSize);
    expect(result).toEqual({races: testData.races, pagination: testData.pagination});
  });
});

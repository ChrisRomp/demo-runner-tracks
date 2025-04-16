// tests for routes/[id]/+page.server.ts
// Does not test for 400 errors on invalid page input as that is handled by the getParsedPage function

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { load } from './+page.server';
import { getParsedPage, getPagination } from '$lib/utils/pagination';
import raceService from '$lib/data/race-service';

vi.mock('$lib/utils/pagination');
vi.mock('$lib/data/race-service');

beforeEach(() => {
  vi.clearAllMocks();
});

describe('load green path', () => {
  function arrangeTest(id: number, page: number | null) {
    const race = { id, participantCount: 42 }
    const pagination = { page };

    vi.mocked(getParsedPage).mockReturnValue(page as any);
    vi.mocked(getPagination).mockReturnValue(pagination as any);
    vi.mocked(raceService.getByIdWithPagedParticipants).mockResolvedValue(race as any);

    const url = new URL(`http://localhost/race/${id}`);
    if (page) {
      url.searchParams.set('page', page.toString());
    }

    return {
      id,
      page,
      pageSize: 10,
      pagination,
      params: { id },
      participantCount: 42,
      race,
      url
    }
  }

  function assertTest({ page, pageSize, pagination, params, participantCount, race, result }: any) {
    expect(getParsedPage).toHaveBeenCalledWith(page ? page.toString() : null);
    expect(getPagination).toHaveBeenCalledWith(page, pageSize, participantCount);
    expect(raceService.getByIdWithPagedParticipants).toHaveBeenCalledWith(params.id, page, pageSize);
    expect(result).toEqual({ race, pagination });
  }

  it('should load default page for race 1', async () => {
    const testData = arrangeTest(1, null);

    const result = await load({ params: testData.params, url: testData.url });

    assertTest({...testData, result});
  });

  it('should load page 2 for race 1', async () => {
    const testData = arrangeTest(1, 2);
    
    const result = await load({ params: testData.params, url: testData.url });
    
    assertTest({...testData, result});
  });

  it('should load default page for race 2', async () => {
    const testData = arrangeTest(2, null); 
    
    const result = await load({ params: testData.params, url: testData.url });
    
    assertTest({...testData, result});
  });

  it('should load page 2 for race 2', async () => {
    const testData = arrangeTest(2, 2);
    
    const result = await load({ params: testData.params, url: testData.url });
    
    assertTest({...testData, result});
  });
});

describe('load error path', () => {
  it('should return 404 when race is null', async () => {
    const params = { id: 999 };
    const url = new URL(`http://localhost/race/${params.id}`);

    vi.mocked(raceService.getByIdWithPagedParticipants).mockResolvedValue(null);

    await expect(load({ params, url })).rejects.toThrowError(expect.objectContaining({ status: 404 }));
  });
});
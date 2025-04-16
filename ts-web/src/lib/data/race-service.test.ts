import { describe, it, expect, vi, beforeEach } from 'vitest';
import raceService from '$lib/data/race-service';
import prisma from '$lib/data/prisma';

vi.mock('$lib/data/prisma');

beforeEach(() => {
  vi.resetAllMocks();
});

describe('RaceService - getPaged', () => {
  function setupTest() {
    const races = [{id: 1}];
    const raceCount = 42;
    vi.mocked(prisma.race.findMany).mockResolvedValue(races as any);
    vi.mocked(prisma.race.count).mockResolvedValue(raceCount);
    return {
      races,
      raceCount,
    };
  }
  
  it('should default to page 1', async () => {
    const testData = setupTest();
    const skip = 0;
    const take = 10;
    const orderBy = { dateTime: 'desc' };
    
    const result = await raceService.getPaged();

    expect(prisma.race.findMany).toHaveBeenCalledWith({ skip, take, orderBy });
    expect(result).toEqual(testData);
  });

  it('should return page 2', async () => {
    const testData = setupTest();
    const skip = 10;
    const take = 10;
    const orderBy = { dateTime: 'desc' };
    
    const result = await raceService.getPaged(2);

    expect(prisma.race.findMany).toHaveBeenCalledWith({ skip, take, orderBy });
    expect(result).toEqual(testData);
  });

  it('should handle custom page size', async () => {
    const testData = setupTest();
    const skip = 0;
    const take = 5;
    const orderBy = { dateTime: 'desc' };
    
    const result = await raceService.getPaged(1, 5);

    expect(prisma.race.findMany).toHaveBeenCalledWith({ skip, take, orderBy });
    expect(result).toEqual(testData);
  });

  // checks that an empty array is returned correctly
  it('should handle empty results', async () => {
    vi.mocked(prisma.race.findMany).mockResolvedValue([]);
    vi.mocked(prisma.race.count).mockResolvedValue(0);

    const result = await raceService.getPaged();

    expect(result).toEqual({
      races: [],
      raceCount: 0
    });
  });
});

describe('RaceService - getByIdWithPagedParticipants', () => {
  // helper function to create mock race and setup mock prisma function
  function setupTest() {
    // the actual race object doesn't matter, we just need to make sure it's returned
    const race = {
      id: 1,
      name: 'Test Race',
      _count: {
        participants: 42,
      },
      participants: [
        {
          id: 1,
          elapsedTimeInSeconds: 1000,
        },
      ],
    };

    // setup the mock prisma function
    vi.mocked(prisma.race.findUnique).mockResolvedValue(race as any);

    // add the participant count to the expected result
    return {
      ...race,
      participantCount: 42,
    };
  }

  // helper function to get the expected arguments for the findUnique function
  function getExpectedFindUniqueArgs(id: number, skip: number, take: number, orderBy: any) {
    return {
      where: { id },
      include: {
        _count: {
          select: { participants: true },
        },
        participants: {
          orderBy,
          skip,
          take,
        },
      },
    };
  }
  
  it('should return page one with default parameters', async () => {
    const testData = setupTest();
    const skip = 0;
    const take = 10;
    const orderBy = { elapsedTimeInSeconds: 'asc' };

    const result = await raceService.getByIdWithPagedParticipants(1);

    expect(prisma.race.findUnique).toHaveBeenCalledWith(getExpectedFindUniqueArgs(1, skip, take, orderBy));
    expect(result).toEqual(testData);
  });

  it('should return page 2 with custom page', async () => {
    const testData = setupTest();
    const skip = 10;
    const take = 10;
    const orderBy = { elapsedTimeInSeconds: 'asc' };

    const result = await raceService.getByIdWithPagedParticipants(1, 2);

    expect(prisma.race.findUnique).toHaveBeenCalledWith(getExpectedFindUniqueArgs(1, skip, take, orderBy));
    expect(result).toEqual(testData);
  });

  it('should handle custom page size', async () => {
    const testData = setupTest();
    const skip = 0;
    const take = 5;
    const orderBy = { elapsedTimeInSeconds: 'asc' };

    const result = await raceService.getByIdWithPagedParticipants(1, 1, 5);

    expect(prisma.race.findUnique).toHaveBeenCalledWith(getExpectedFindUniqueArgs(1, skip, take, orderBy));
    expect(result).toEqual(testData);
  });

  // checks that null is returned when no race is returned by prisma
  it('should return null when race does not exist', async () => {
    vi.mocked(prisma.race.findUnique).mockResolvedValue(null);

    const result = await raceService.getByIdWithPagedParticipants(999);

    expect(prisma.race.findUnique).toHaveBeenCalledWith({
      where: { id: 999 },
      include: {
        _count: {
          select: { participants: true },
        },
        participants: {
          orderBy: { elapsedTimeInSeconds: 'asc' },
          skip: 0,
          take: 10,
        },
      },
    });
    expect(result).toBeNull();
  });
});
import prisma from '$lib/data/prisma';
import { type Race, type RaceResult } from '@prisma/client';

// DTOs for return types
export interface RacesDTO {
  races: Race[];
  raceCount: number;
}

export interface RaceWithParticipants extends Race {
  participants: RaceResult[];
  participantCount: number;
}

export interface RaceService {
  getPaged(page?: number, pageSize?: number): Promise<RacesDTO>;
  getByIdWithPagedParticipants(id: number, page?: number, pageSize?: number): Promise<RaceWithParticipants | null>;
}

const raceService: RaceService = {
  async getPaged(page = 1, pageSize = 10): Promise<RacesDTO> {
    // Would use transactions but SQLite doesn't support them
    const [ races, raceCount ] = await Promise.all([
      prisma.race.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: {
          dateTime: 'desc'
        }
      }),
      prisma.race.count()
    ]);

    return {
      races,
      raceCount
    };
  },

  async getByIdWithPagedParticipants(id: number, page = 1, pageSize = 10): Promise<RaceWithParticipants | null> {
    const race = await prisma.race.findUnique({
      where: { id },
      include: {
        _count: {
          select: { participants: true }
        },
        participants: {
          orderBy: {
            elapsedTimeInSeconds: 'asc',
          },
          skip: (page - 1) * pageSize,
          take: pageSize,
        },
      },
    });

    if (!race) return null;

    return {
      ...race,
      participantCount: race._count.participants,
    };
  }
};

export default raceService;

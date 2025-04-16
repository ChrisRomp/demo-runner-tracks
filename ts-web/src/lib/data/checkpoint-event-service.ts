import { type CheckpointEvent } from '@prisma/client';
import prisma from '$lib/data/prisma';

export interface CheckpointEventDTO {
  eventTime: Date;
  checkpointId: number;
  bibNumber: number;
  raceId: number;
}

export interface CheckpointEventService {
  create(checkpointEvent: CheckpointEventDTO): Promise<CheckpointEvent>;
  getByRaceAndBib(raceId: number, bibNumber: number): Promise<CheckpointEventResult[]>;
}

interface CheckpointEventResult {
  bibNumber: number;
  location: number;
  description: string;
  eventTime: Date;
}

const checkpointEventService: CheckpointEventService = {
  create: async (data: CheckpointEventDTO) => {
    return await prisma.checkpointEvent.create({data});
  },

  getByRaceAndBib: async (raceId: number, bibNumber: number): Promise<CheckpointEventResult[]> => {
    const results = await prisma.checkpointEvent.findMany({
      where: {
        raceId,
        bibNumber
      },
      select: {
        bibNumber: true,
        eventTime: true,
        checkpoint: {
          select: {
            location: true,
            description: true
          }
        }
      },
      orderBy: {
        eventTime: 'asc'
      }
    });

    return results.map(result => ({
      bibNumber: result.bibNumber,
      location: result.checkpoint.location,
      description: result.checkpoint.description,
      eventTime: result.eventTime
    }));
  }
}

export default checkpointEventService;
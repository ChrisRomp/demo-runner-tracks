import { type Checkpoint } from '@prisma/client';
import prisma from '$lib/data/prisma';

export interface CheckpointService {
  getByRace(raceId: number): Promise<Checkpoint[]>;
}

const checkpointService: CheckpointService = {
  async getByRace(raceId: number) {
    return await prisma.checkpoint.findMany({
      where: { raceId },
      orderBy: { location: 'asc' }
    });
  }
}

export default checkpointService;
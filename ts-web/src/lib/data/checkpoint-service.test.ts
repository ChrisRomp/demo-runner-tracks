import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mockDeep, mockReset } from 'vitest-mock-extended';
import prisma from '$lib/data/prisma';
import checkpointService from './checkpoint-service';
import type { Checkpoint } from '@prisma/client';

vi.mock('$lib/data/prisma', () => ({
  default: mockDeep()
}));

describe('checkpointService', () => {
  const mockPrisma = prisma as ReturnType<typeof mockDeep<typeof prisma>>;

  beforeEach(() => {
    mockReset(mockPrisma);
  });

  const testCheckpoints: Checkpoint[] = [
    {
      id: 1,
      location: 5.0,
      description: 'Start',
      raceId: 1
    },
    {
      id: 2,
      location: 10.0,
      description: 'Middle',
      raceId: 1
    }
  ];

  describe('getByRace', () => {
    it('should return checkpoints for a valid race id', async () => {
      mockPrisma.checkpoint.findMany.mockResolvedValue(testCheckpoints);
      
      const result = await checkpointService.getByRace(1);
      
      expect(result).toEqual(testCheckpoints);
    });

    it('should return empty array when no checkpoints exist', async () => {
      mockPrisma.checkpoint.findMany.mockResolvedValue([]);
      
      const result = await checkpointService.getByRace(999);
      
      expect(result).toEqual([]);
    });

    it('should call prisma with correct parameters', async () => {
      await checkpointService.getByRace(1);
      
      expect(mockPrisma.checkpoint.findMany).toHaveBeenCalledWith({
        where: { raceId: 1 },
        orderBy: { location: 'asc' }
      });
    });

    it('should handle database error', async () => {
      mockPrisma.checkpoint.findMany.mockRejectedValue(new Error('DB Error'));
      
      await expect(checkpointService.getByRace(1)).rejects.toThrow('DB Error');
    });

    it('should return checkpoints ordered by location', async () => {
      const unorderedCheckpoints = [...testCheckpoints].reverse();
      mockPrisma.checkpoint.findMany.mockResolvedValue(unorderedCheckpoints);
      
      const result = await checkpointService.getByRace(1);
      
      expect(result).toEqual(unorderedCheckpoints);
      expect(mockPrisma.checkpoint.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: { location: 'asc' }
        })
      );
    });
  });
});
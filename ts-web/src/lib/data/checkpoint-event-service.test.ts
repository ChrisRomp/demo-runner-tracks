import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PrismaClient } from '@prisma/client';
import { mockDeep, mockReset } from 'vitest-mock-extended';
import checkpointEventService, { type CheckpointEventDTO } from './checkpoint-event-service';
import prisma from '$lib/data/prisma';

vi.mock('$lib/data/prisma', () => ({
  default: mockDeep<PrismaClient>()
}));

describe('checkpointEventService', () => {
  const mockPrisma = prisma as unknown as ReturnType<typeof mockDeep<PrismaClient>>;
  
  beforeEach(() => {
    mockReset(mockPrisma);
  });

  describe('create', () => {
    function setupTestData() {
      const checkpointEventDTO: CheckpointEventDTO = {
        eventTime: new Date('2024-01-01T10:00:00Z'),
        checkpointId: 1,
        bibNumber: 42,
        raceId: 1
      };

      const expectedCreatedEvent = {
        id: 1,
        ...checkpointEventDTO
      };

      mockPrisma.checkpointEvent.create.mockResolvedValue(expectedCreatedEvent);

      return {
        checkpointEventDTO,
        expectedCreatedEvent
      };
    }

    it('should create a checkpoint event successfully', async () => {
      const { checkpointEventDTO, expectedCreatedEvent } = setupTestData();

      const result = await checkpointEventService.create(checkpointEventDTO);

      expect(result).toEqual(expectedCreatedEvent);
      expect(mockPrisma.checkpointEvent.create).toHaveBeenCalledTimes(1);
      expect(mockPrisma.checkpointEvent.create).toHaveBeenCalledWith({
        data: checkpointEventDTO
      });
    });

    it('should pass through any errors from the database', async () => {
      const { checkpointEventDTO } = setupTestData();
      const expectedError = new Error('Database error');
      mockPrisma.checkpointEvent.create.mockRejectedValue(expectedError);

      await expect(checkpointEventService.create(checkpointEventDTO))
        .rejects.toThrow(expectedError);
    });

    it('should handle all required DTO properties', async () => {
      const { checkpointEventDTO, expectedCreatedEvent } = setupTestData();

      await checkpointEventService.create(checkpointEventDTO);

      expect(mockPrisma.checkpointEvent.create).toHaveBeenCalledWith({
        data: {
          eventTime: checkpointEventDTO.eventTime,
          checkpointId: checkpointEventDTO.checkpointId,
          bibNumber: checkpointEventDTO.bibNumber,
          raceId: checkpointEventDTO.raceId
        }
      });
    });
  });

  describe('getByRaceAndBib', () => {
    function setupTestData() {
      const mockPrismaResults = [
        {
          id: 1,
          raceId: 1,
          checkpointId: 1,
          bibNumber: 42,
          eventTime: new Date('2024-01-01T10:00:00Z'),
          checkpoint: {
            location: 1,
            description: 'Start Line'
          }
        },
        {
          id: 2,
          raceId: 1,
          checkpointId: 2,
          bibNumber: 42,
          eventTime: new Date('2024-01-01T11:00:00Z'),
          checkpoint: {
            location: 2,
            description: 'Mile 1'
          }
        }
      ];

      const expectedMappedResults = mockPrismaResults.map(result => ({
        bibNumber: result.bibNumber,
        location: result.checkpoint.location,
        description: result.checkpoint.description,
        eventTime: result.eventTime
      }));

      mockPrisma.checkpointEvent.findMany.mockResolvedValue(mockPrismaResults);

      return { mockPrismaResults, expectedMappedResults };
    }

    it('should correctly map prisma results to CheckpointEventResult', async () => {
      const { mockPrismaResults, expectedMappedResults } = setupTestData();
      
      const result = await checkpointEventService.getByRaceAndBib(1, 42);

      expect(result).toEqual(expectedMappedResults);
      expect(result[0]).toHaveProperty('location');
      expect(result[0]).toHaveProperty('description');
      expect(result[0]).toHaveProperty('eventTime');
      expect(result[0]).toHaveProperty('bibNumber');
    });

    it('should preserve checkpoint nested data structure', async () => {
      setupTestData();
      
      await checkpointEventService.getByRaceAndBib(1, 42);

      expect(mockPrisma.checkpointEvent.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          select: {
            bibNumber: true,
            eventTime: true,
            checkpoint: {
              select: {
                location: true,
                description: true
              }
            }
          }
        })
      );
    });

    it('should maintain correct data types in mapped result', async () => {
      setupTestData();
      
      const result = await checkpointEventService.getByRaceAndBib(1, 42);
      const firstResult = result[0];

      expect(firstResult.bibNumber).toBeTypeOf('number');
      expect(firstResult.location).toBeTypeOf('number');
      expect(firstResult.description).toBeTypeOf('string');
      expect(firstResult.eventTime).toBeInstanceOf(Date);
    });
  });
});
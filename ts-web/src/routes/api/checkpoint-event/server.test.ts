import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET, POST } from './+server';
import checkpointEventService from '$lib/data/checkpoint-event-service';

vi.mock('$lib/data/checkpoint-event-service');

describe('checkpoint-event endpoints', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('GET', () => {
    it('should return 400 if raceId is missing', async () => {
      const url = new URL('http://localhost/api/checkpoint-event?bibNumber=42');
      const response = await GET({ url } as any);
      
      expect(response.status).toBe(400);
    });

    it('should return 400 if bibNumber is missing', async () => {
      const url = new URL('http://localhost/api/checkpoint-event?raceId=1');
      const response = await GET({ url } as any);
      
      expect(response.status).toBe(400);
    });

    it('should return checkpoint events when parameters are valid', async () => {
      const expectedEvents = [
        { id: 1, eventTime: new Date(), checkpointId: 1, bibNumber: 42, raceId: 1 }
      ];
      vi.mocked(checkpointEventService.getByRaceAndBib).mockResolvedValue(expectedEvents);

      const url = new URL('http://localhost/api/checkpoint-event?raceId=1&bibNumber=42');
      const response = await GET({ url } as any);
      const data = await response.json();
      // convert to correct datatype
      data[0].eventTime = new Date(data[0].eventTime);
      
      expect(response.status).toBe(200);
      expect(data).toEqual(expectedEvents);
      expect(checkpointEventService.getByRaceAndBib).toHaveBeenCalledWith(1, 42);
    });
  });

  describe('POST', () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    const testCheckpointDTO = {
      eventTime: new Date('2023-10-20T10:00:00Z'),
      checkpointId: 1,
      bibNumber: 123,
      raceId: 1
    };

    it('should create checkpoint event and return 201', async () => {
      const mockReturn = { id: 1, ...testCheckpointDTO };
      vi.mocked(checkpointEventService.create).mockResolvedValue(mockReturn);

      const request = new Request('http://localhost', {
        method: 'POST',
        body: JSON.stringify(testCheckpointDTO)
      });

      const response = await POST({ request });
      const data = await response.json();
      data.eventTime = new Date(data.eventTime);

      expect(response.status).toBe(201);
      expect(checkpointEventService.create).toHaveBeenCalledWith(testCheckpointDTO);
      expect(data).toEqual(mockReturn);
    });

    it('should return 400 when eventTime is missing', async () => {
      const { eventTime, ...invalidData } = testCheckpointDTO;
      
      const request = new Request('http://localhost', {
        method: 'POST',
        body: JSON.stringify(invalidData)
      });

      const response = await POST({ request });
      expect(response.status).toBe(400);
    });

    it('should return 400 when checkpointId is missing', async () => {
      const { checkpointId, ...invalidData } = testCheckpointDTO;
      
      const request = new Request('http://localhost', {
        method: 'POST',
        body: JSON.stringify(invalidData)
      });

      const response = await POST({ request });
      expect(response.status).toBe(400);
    });

    it('should return 400 when bibNumber is missing', async () => {
      const { bibNumber, ...invalidData } = testCheckpointDTO;
      
      const request = new Request('http://localhost', {
        method: 'POST',
        body: JSON.stringify(invalidData)
      });

      const response = await POST({ request });
      expect(response.status).toBe(400);
    });

    it('should convert string values to correct types', async () => {
      const mockReturn = { id: 1, ...testCheckpointDTO };
      vi.mocked(checkpointEventService.create).mockResolvedValue(mockReturn);

      const request = new Request('http://localhost', {
        method: 'POST',
        body: JSON.stringify(testCheckpointDTO)
      });

      await POST({ request });

      expect(checkpointEventService.create).toHaveBeenCalledWith(testCheckpointDTO);
    });
  });
});
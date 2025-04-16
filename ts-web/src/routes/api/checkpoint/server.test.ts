import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from './+server';
import checkpointService from '$lib/data/checkpoint-service';
import type { Checkpoint } from '@prisma/client';

vi.mock('$lib/data/checkpoint-service');

describe('GET /api/checkpoint', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockCheckpoints: Checkpoint[] = [
    {
      id: 1,
      location: 5.0,
      description: 'Start',
      raceId: 1
    },
    {
      id: 2,
      location: 10.0,
      description: 'Finish',
      raceId: 1
    }
  ];

  it('should return checkpoints when valid raceId provided', async () => {
    vi.mocked(checkpointService.getByRace).mockResolvedValue(mockCheckpoints);

    const url = new URL('http://localhost/api/checkpoint?raceId=1');
    const response = await GET({ url });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual(mockCheckpoints);
    expect(checkpointService.getByRace).toHaveBeenCalledWith(1);
  });

  it('should return 400 when raceId is missing', async () => {
    const url = new URL('http://localhost/api/checkpoint');
    
    await expect(GET({ url })).rejects.toThrowError(expect.objectContaining({ status: 400 }));
  });

  it('should handle service errors', async () => {
    vi.mocked(checkpointService.getByRace).mockRejectedValue(new Error('Service error'));
    
    const url = new URL('http://localhost/api/checkpoint?raceId=1');
    
    await expect(GET({ url })).rejects.toThrow('Service error');
  });

  it('should parse raceId as integer', async () => {
    vi.mocked(checkpointService.getByRace).mockResolvedValue(mockCheckpoints);

    const url = new URL('http://localhost/api/checkpoint?raceId=1');
    await GET({ url });

    expect(checkpointService.getByRace).toHaveBeenCalledWith(1);
    expect(checkpointService.getByRace).not.toHaveBeenCalledWith('1');
  });

  it('should call service with correct parameters', async () => {
    vi.mocked(checkpointService.getByRace).mockResolvedValue([]);

    const url = new URL('http://localhost/api/checkpoint?raceId=5');
    await GET({ url });

    expect(checkpointService.getByRace).toHaveBeenCalledTimes(1);
    expect(checkpointService.getByRace).toHaveBeenCalledWith(5);
  });
});
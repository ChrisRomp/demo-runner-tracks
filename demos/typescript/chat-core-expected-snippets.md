# Chat - core experience - expected snippets

Below are examples of the code Copilot could generate when running the [Copilot Chat - core experience](./chat-corer.md) demo. These are representative of what Copilot may generate to give you a sense of what to expect. The actual code will vary.

## Create function

```typescript
// ...existing code...

export interface CreateRaceDTO {
  name: string;
  distance: number;
  location: string;
  dateTime: Date;
}

export class RaceService {
  // ...existing code...

  async create(race: CreateRaceDTO): Promise<Race> {
    if (!race.name || race.name.trim().length === 0) {
      throw new Error('Name is required');
    }

    if (race.distance <= 0) {
      throw new Error('Distance must be greater than 0');
    }

    if (!race.location || race.location.trim().length === 0) {
      throw new Error('Location is required');
    }

    if (!race.dateTime || race.dateTime < new Date()) {
      throw new Error('Date must be in the future');
    }

    return await prisma.race.create({
      data: {
        name: race.name.trim(),
        distance: race.distance,
        location: race.location.trim(),
        dateTime: race.dateTime
      }
    });
  }
}
```

## Unit tests

```typescript
describe('RaceService - create', () => {
  function setupTest() {
    const race = {
      id: 1,
      name: 'Test Race',
      distance: 42.2,
      location: 'Test Location',
      dateTime: new Date(Date.now() + 86400000),
      participants: [],
      checkpoints: []
    };
    vi.mocked(prisma.race.create).mockResolvedValue(race as any);
    return race;
  }

  it('should create race with valid data', async () => {
    const testData = setupTest();
    const input = {
      name: '  Test Race  ',
      distance: 42.2,
      location: '  Test Location  ',
      dateTime: testData.dateTime
    };

    const result = await raceService.create(input);

    expect(prisma.race.create).toHaveBeenCalledWith({
      data: {
        name: 'Test Race',
        distance: 42.2,
        location: 'Test Location',
        dateTime: testData.dateTime
      }
    });
    expect(result).toEqual(testData);
  });

  it('should throw error for empty name', async () => {
    await expect(raceService.create({
      name: '',
      distance: 42.2,
      location: 'Test Location',
      dateTime: new Date(Date.now() + 86400000)
    })).rejects.toThrow('Name is required');
  });

  it('should throw error for name with only spaces', async () => {
    await expect(raceService.create({
      name: '   ',
      distance: 42.2,
      location: 'Test Location',
      dateTime: new Date(Date.now() + 86400000)
    })).rejects.toThrow('Name is required');
  });

  it('should throw error for zero distance', async () => {
    await expect(raceService.create({
      name: 'Test Race',
      distance: 0,
      location: 'Test Location',
      dateTime: new Date(Date.now() + 86400000)
    })).rejects.toThrow('Distance must be greater than 0');
  });

  it('should throw error for negative distance', async () => {
    await expect(raceService.create({
      name: 'Test Race',
      distance: -1,
      location: 'Test Location',
      dateTime: new Date(Date.now() + 86400000)
    })).rejects.toThrow('Distance must be greater than 0');
  });

  it('should throw error for empty location', async () => {
    await expect(raceService.create({
      name: 'Test Race',
      distance: 42.2,
      location: '',
      dateTime: new Date(Date.now() + 86400000)
    })).rejects.toThrow('Location is required');
  });

  it('should throw error for location with only spaces', async () => {
    await expect(raceService.create({
      name: 'Test Race',
      distance: 42.2,
      location: '   ',
      dateTime: new Date(Date.now() + 86400000)
    })).rejects.toThrow('Location is required');
  });

  it('should throw error for missing date', async () => {
    await expect(raceService.create({
      name: 'Test Race',
      distance: 42.2,
      location: 'Test Location',
      dateTime: null as any
    })).rejects.toThrow('Date must be in the future');
  });

  it('should throw error for past date', async () => {
    await expect(raceService.create({
      name: 'Test Race',
      distance: 42.2,
      location: 'Test Location',
      dateTime: new Date(Date.now() - 86400000)
    })).rejects.toThrow('Date must be in the future');
  });
});
```
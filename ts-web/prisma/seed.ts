import { PrismaClient, Race } from '@prisma/client';
import fs from 'fs';

const prisma = new PrismaClient();

async function main() {
  await createRunners();
  await createRaces();
}

async function createRunners() {
    // load names from names.txt
    const runnerNames = fs.readFileSync('prisma/runner-names.txt', 'utf8').split('\n');
    for (let i = 0; i < runnerNames.length; i++) {
      const name = runnerNames[i];
      await createRunner(name);
    }
}

async function createRunner(name: string) {
    // create random age between 18 and 88
    const age = Math.floor(Math.random() * 71) + 18;
  await prisma.runner.create({
    data: {
      name,
      age
    },
  });
}

async function createRaces() {
   // read the raceNames from race-names.txt
   const raceNames = fs.readFileSync('prisma/race-names.txt', 'utf8').split('\n');
  for (let i = 0; i < raceNames.length; i++) {
    const raceName = raceNames[i];
    const distance = getRaceDistance(raceName);
    const location = getRaceLocation(i);
    const dateTime = getRaceDate();

    await createRace(raceName, distance, location, dateTime);
  }
}

function getRaceDistance(raceName: string): number {
  const name = raceName.toLowerCase();

  if (name.includes('marathon')) {
    if (name.includes('half')) {
      return 21.1; // Half Marathon
    } else if (name.includes('quarter')) {
      return 10.55; // Quarter Marathon
    } else if (name.includes('mini')) {
      return 5.275; // Mini Marathon
    } else {
      return 42.2; // Marathon
    }
  } else if (name.includes('5k')) {
    return 5; // 5 km
  } else if (name.includes('10k')) {
    return 10; // 10 km
  } else {
    const distances = [5, 10, 21.1, 42.2];
    return distances[Math.floor(Math.random() * distances.length)];
  }
}

function getRaceLocation(index: number): string {
  return `Location ${index + 1}`;
}

function getRaceDate(): Date {
  return new Date(
    2024,
    Math.floor(Math.random() * 12),
    Math.floor(Math.random() * 28) + 1
  );
}

async function createRace(name: string, distance: number, location: string, dateTime: Date) {
  const race = await prisma.race.create({
    data: {
      name,
      distance,
      location,
      dateTime,
    },
  });

  await createParticipants(race);
}

async function createParticipants(race: Race) {
  const numberOfParticipants = Math.floor(Math.random() * 31) + 20;

  const runnerIds: number[] = [];
  while (runnerIds.length < numberOfParticipants) {
    const id = Math.floor(Math.random() * 100) + 1;
    if (!runnerIds.includes(id)) {
      runnerIds.push(id);
    }
  }

  for (const id of runnerIds) {
    // Generate a random start time between 8:00 and 8:15
    const raceDate = new Date(race.dateTime);
    const startHour = 8;
    const startMinute = Math.floor(Math.random() * 16); // 0 to 15 minutes
    const startTime = new Date(raceDate.setHours(startHour, startMinute, 0, 0));

    // Generate a random pace between 180 and 720 seconds per kilometer
    const pacePerKmSeconds = Math.floor(Math.random() * (720 - 180 + 1)) + 180; // 180 to 720 seconds per km
    const raceDistanceKm = race.distance; // Assuming race.distance is in kilometers
    const totalSeconds = Math.floor(pacePerKmSeconds * raceDistanceKm); // Total time in seconds

    // Calculate end time
    const endTime = new Date(startTime.getTime() + totalSeconds * 1000);


    // Create race result
    await prisma.raceResult.create({
      data: {
        raceId: race.id,
        runnerId: id,
        startTime: startTime,
        endTime: endTime,
        elapsedTimeInSeconds: totalSeconds,
      },
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
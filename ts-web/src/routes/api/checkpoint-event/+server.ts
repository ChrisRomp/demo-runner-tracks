import checkpointEventService, { type CheckpointEventDTO } from "$lib/data/checkpoint-event-service";
import { json } from '@sveltejs/kit';

export async function POST({ request }) {
  const jsonData = await request.json() as any;

  if (!jsonData.eventTime || !jsonData.checkpointId || !jsonData.bibNumber || !jsonData.raceId) {
    return new Response('Missing required fields', { status: 400 });
  }

  const data: CheckpointEventDTO = {
    eventTime: new Date(jsonData.eventTime),
    checkpointId: Number(jsonData.checkpointId),
    bibNumber: Number(jsonData.bibNumber),
    raceId: Number(jsonData.raceId)
  };

  const checkpointEvent = await checkpointEventService.create(data);

  return json(checkpointEvent, { status: 201 });
}

export async function GET({ url }) {
  const raceId = url.searchParams.get('raceId');
  const bibNumber = url.searchParams.get('bibNumber');

  if (!raceId || !bibNumber) {
    return new Response('Missing required parameters', { status: 400 });
  }

  const events = await checkpointEventService.getByRaceAndBib(
    Number(raceId),
    Number(bibNumber)
  );

  return json(events);
}

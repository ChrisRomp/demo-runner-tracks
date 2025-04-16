<script lang="ts">
  import Pagination from '$lib/components/Pagination.svelte';
  export let data;
  $: pagination = data.pagination;

  function formatTime(seconds: number | null) {
    if (!seconds) {
      return '';
    }
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  $: currentPage = data.pagination.page;
</script>

<header class="header-banner">
  <h2>{data.race.name}</h2>
</header>
<ul class="flex justify-center space-x-6 p-6">
  <li>Date: {new Date(data.race.dateTime).toLocaleDateString()}</li>
  <li>Distance: {data.race.distance} km</li>
  <li>Location: {data.race.location}</li>
</ul>

<div class="overflow-x-auto">
  <table class="w-full table-auto border-collapse rounded-lg overflow-hidden" id="race-results" aria-label="Race Results">
    <thead>
      <tr class="bg-gray-700">
        <th class="px-4 py-2 w-1/4">Place</th>
        <th class="px-4 py-2 w-1/2">Name</th>
        <th class="px-4 py-2 w-1/4">Age</th>
        <th class="px-4 py-2 w-1/4">Time</th>
      </tr>
    </thead>
    <tbody>
      {#each data.race.participants as result, index}
        <tr class="even:bg-gray-600 odd:bg-gray-700" aria-label="Participant {result.runnerName}">
          <td class="px-4 py-2 w-1/4">{index + 1 + (currentPage - 1) * data.pagination.pageSize}</td>
          <td class="px-4 py-2 w-1/2">{result.runnerName}</td>
          <td class="px-4 py-2 w-1/4">{result.runnerAge}</td>
          <td class="px-4 py-2 w-1/4">{formatTime(result.elapsedTimeInSeconds)}</td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>

<Pagination {pagination} />
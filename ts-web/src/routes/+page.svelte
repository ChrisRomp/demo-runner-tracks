<script lang="ts">
  import Pagination from '$lib/components/Pagination.svelte';

  export let data;
  $: pagination = data.pagination;
</script>

<svelte:head>
  <title>Find your next race</title>
</svelte:head>

<header class="header-banner">
  <h2>Find your next race</h2>
</header>

<table class="w-full table-auto border-collapse rounded-lg overflow-hidden mt-4" aria-label="race-list">
  <thead>
    <tr class="bg-gray-700">
      <th class="px-4 py-2 w-1/2">Race Name</th>
      <th class="px-4 py-2 w-1/4">Distance (km)</th>
      <th class="px-4 py-2 w-1/4">Date</th>
    </tr>
  </thead>
  <tbody>
    {#each data.races as race}
      <tr class="even:bg-gray-600 odd:bg-gray-700">
        <td class="px-4 py-2 w-1/2">
          <a href="/race/{race.id}" class="text-blue-500 hover:underline" aria-label="Race {race.name}">{race.name}</a>
        </td>
        <td class="px-4 py-2 w-1/4">{race.distance}</td>
        <td class="px-4 py-2 w-1/4">{new Date(race.dateTime).toLocaleDateString()}</td>
      </tr>
    {/each}
  </tbody>
</table>

<Pagination {pagination} />
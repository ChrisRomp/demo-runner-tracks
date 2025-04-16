<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import { type PaginationData } from '$lib/utils/pagination';
  export let pagination: PaginationData;
  $: pageNumber = pagination.page;
  $: totalPages = pagination.totalPages;

  function goToPage(pageNumber: number) {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      const url = new URL(page.url);
      url.searchParams.set('page', pageNumber.toString());
      goto(url);
    }
  }

  function nextPage() {
    if (pageNumber < totalPages) {
      goToPage(pageNumber + 1);
    }
  }

  function previousPage() {
    if (pageNumber > 1) {
      goToPage(pageNumber - 1);
    }
  }
</script>

<div class="flex justify-between items-center m-4">
  <div class="text-lg text-gray-400 ml-6" aria-label="pagination">
    Page {pageNumber} of {totalPages}
  </div>
  <div class="pagination flex justify-center mr-6">
    <button on:click={previousPage} disabled={pageNumber === 1} class="bg-blue-500 text-white px-4 py-2 mx-2 rounded disabled:bg-gray-500 disabled:cursor-not-allowed">Previous</button>
    <button on:click={nextPage} disabled={pageNumber === totalPages} class="bg-blue-500 text-white px-4 py-2 mx-2 rounded disabled:bg-gray-500 disabled:cursor-not-allowed">Next</button>
  </div>
</div>

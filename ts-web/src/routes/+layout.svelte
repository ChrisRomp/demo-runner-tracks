<script lang="ts">
  import '../app.css';
  import { page } from "$app/state";
</script>

<nav class="bg-gray-900 p-2 shadow-lg">
  <div class="container mx-auto flex justify-between items-center">
    <a href="/" class="text-xl font-bold text-white">Runner Tracks</a>
  </div>
</nav>

<div class="container mx-auto sm:my-2 pb-2 bg-gray-900 text-white rounded-lg shadow-lg">
  {#if page.data.session}
  <section class="flex items-center justify-center mt-4">
    <div class="w-full flex justify-center">
      <span class="signedInText text-center">
        <small>Welcome back, </small>
        <strong>{page.data.session.user?.name ?? "User"}</strong>
      </span>
    </div>
  </section>
  {/if}
  <slot />
</div>


<script lang="ts">
  import { scale } from "svelte/transition";

  export let letter: string;
  export let correct: boolean;
  export let miss: boolean;
  export let close: boolean;
</script>

{#key letter}
  <div
    class="border border-gray-400 flex justify-center items-center text-2xl md:text-4xl font-bold uppercase"
    in:scale={{ duration: letter ? 150 : 0, start: 1.2 }}
    class:correct
    class:miss
    class:close
  >
    {letter}
  </div>
{/key}

<style>
  div::before {
    content: "";
    display: inline-block;
    padding-bottom: 100%;
  }

  .correct {
    @apply bg-green-500;
  }

  .miss {
    @apply bg-gray-500;
  }

  .close {
    @apply bg-yellow-500;
  }
</style>

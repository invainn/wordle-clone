<script lang="ts">
  import { createEventDispatcher } from "svelte";

  export let letter: string;
  export let disabled: boolean = false;
  export let display: string = letter;
  export let className: string = "";

  const dispatch = createEventDispatcher();
  const isEnter = letter === "Enter";
</script>

<!-- Need to do this since we can't optionally set event handlers without actions -->
{#if isEnter}
  <button
    class="border border-gray-400 text-2xl flex-1 h-[58px] md:h-[64px] uppercase font-semibold"
    data-key={letter}
    formaction={"?/submit"}
    {disabled}
  >
    {display}
  </button>
{:else}
  <button
    class="border border-gray-400 text-2xl flex-1 h-[58px] md:h-[64px] uppercase font-semibold {className}"
    data-key={letter}
    on:click|preventDefault={() => dispatch(`click`, letter)}
    {disabled}
  >
    {display}
  </button>
{/if}

<style>
  .correct {
    @apply bg-green-500;
  }

  .close {
    @apply bg-yellow-500;
  }

  .miss {
    @apply bg-gray-500;
  }
</style>

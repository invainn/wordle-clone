<script lang="ts">
  import { enhance, type SubmitFunction } from "$app/forms";
  import type { ActionData, PageData } from "./$types";
  import Letter from "./Letter.svelte";
  import Square from "./Square.svelte";

  export let data: PageData;
  export let form: ActionData;

  $: guessStates = data.state.guessStates;
  $: guesses = data.state.guesses;

  $: answer = data.state.revealedAnswer;

  $: currentGuess = data.state.guessStates.length;
  $: won = guessStates.at(-1) === "xxxxx";
  $: canSubmit = currentGuess < 6 && guesses[currentGuess].length === 5 && !won;

  let letterClass: Record<string, string>;

  $: {
    letterClass = {};

    data.state.guessStates.forEach((state, currentGuess) => {
      const guess = data.state.guesses[currentGuess];

      // TODO: fix messy logic
      for (let i = 0; i < 5; i++) {
        if (state[i] === "x") {
          letterClass[guess[i]] = "correct";
        } else if (state[i] === "c" && letterClass[guess[i]] !== "correct") {
          letterClass[guess[i]] = "close";
        } else if (
          state[i] === "_" &&
          letterClass[guess[i]] !== "correct" &&
          letterClass[guess[i]] !== "close"
        ) {
          letterClass[guess[i]] = "miss";
        }
      }
    });
  }

  function update({ detail }: CustomEvent) {
    if (currentGuess >= 6) return;

    if (detail === "Backspace") {
      // do we need to guard against empty string?
      guesses[currentGuess] = guesses[currentGuess].slice(0, -1);
    } else if (guesses[currentGuess].length < 5) {
      guesses[currentGuess] += detail;
    }
  }

  function onKeydown(e: KeyboardEvent) {
    if (
      e.metaKey ||
      (!e.code.startsWith("Key") &&
        !e.code.startsWith("Enter") &&
        !e.code.startsWith("Backspace"))
    )
      return;

    document
      .querySelector(`[data-key=${e.key}]`)
      ?.dispatchEvent(new MouseEvent("click", { cancelable: true }));
  }

  const submitHandler: SubmitFunction = () => {
    return async ({ update }) => {
      return update({ reset: false });
    };
  };
</script>

<svelte:window on:keydown={onKeydown} />

<svelte:head>
  <title>wordle clone</title>
</svelte:head>

<form method="POST" action="?/submit" use:enhance={submitHandler}>
  <div class="h-screen flex flex-col justify-center items-center">
    <h1 class="text-4xl m-4">wordle clone</h1>
    <div class="grow flex justify-center items-center w-full">
      <div id="guesses" class="grid grid-rows-6 gap-2 w-64 sm:w-80 md:w-96">
        {#each Array(6) as _, guessIdx (guessIdx)}
          {@const currentRow = currentGuess === guessIdx}
          <div id="row-{guessIdx}" class="grid grid-cols-5 gap-2">
            {#each Array(5) as _, letterIdx}
              {@const guessState = guessStates[guessIdx]?.[letterIdx] ?? ""}
              {@const letter = guesses[guessIdx]?.[letterIdx] ?? ""}
              {@const correct = guessState === "x"}
              {@const miss = guessState === "_"}
              {@const close = guessState === "c"}
              <Square {letter} {correct} {miss} {close} />
              <input
                name="guess"
                disabled={!currentRow}
                type="hidden"
                value={letter}
              />
            {/each}
          </div>
        {/each}
      </div>
    </div>
    {#if won}
      <div class="text-lg md:text-2xl">
        you won! try again?
        <button class="uppercase font-semibold" formaction={"?/restart"}>
          restart
        </button>
      </div>
    {/if}
    {#if !won && guessStates.length === 6}
      <div class="text-lg md:text-2xl">
        you lost, try again? (answer was <span
          class="font-semibold text-green-700">{answer}</span
        >)
        <button class="uppercase font-semibold" formaction={"?/restart"}>
          restart
        </button>
      </div>
    {/if}
    {#if !won && form?.badGuess}
      <div class="text-lg md:text-2xl">bad guess!</div>
    {/if}
    <div id="keyboard" class="w-full md:w-6/12 max-w-xl m-4">
      {#each ["qwertyuiop", "asdfghjkl", "zxcvbnm"] as row, i (i)}
        <div class="flex gap-2 m-2">
          {#if i == 2}
            <Letter
              display={"⏎"}
              letter="Enter"
              on:click={update}
              disabled={!canSubmit}
            />
          {/if}
          {#each row as letter (letter)}
            <Letter
              {letter}
              on:click={update}
              disabled={won}
              className={letterClass[letter]}
            />
          {/each}
          {#if i == 2}
            <Letter
              display={"⌫"}
              letter="Backspace"
              on:click={update}
              disabled={won}
            />
          {/if}
        </div>
      {/each}
    </div>
  </div>
</form>

import { answers } from "./answers";

type GameState = {
  guessStates: string[];
  guesses: string[];
  answer: number;
  revealedAnswer?: string;
};

export function loadGameState(state?: string): GameState {
  if (state) {
    return JSON.parse(state) as GameState;
  }

  return {
    guessStates: [],
    guesses: ["", "", "", "", "", ""],
    answer: Math.floor(Math.random() * answers.length),
  };
}

export function checkGuess(gameState: GameState, guess: string): GameState {
  const nextGameState = structuredClone(gameState);

  const currentGuess = nextGameState.guessStates.length;
  nextGameState.guesses[currentGuess] = guess;

  const guessState: string[] = [];
  const answer = answers[nextGameState.answer];

  // Check correct characters, add unsolved characters to obj
  const unsolved: Record<string, number> = {};
  for (let i = 0; i < 5; i++) {
    if (answer[i] === guess[i]) {
      guessState.push("x");
    } else {
      guessState.push("_");
      unsolved[answer[i]] = unsolved[answer[i]] ?? 0;
      unsolved[answer[i]] += 1;
    }
  }

  // Check if unsolved character was "close"
  for (let i = 0; i < 5; i++) {
    if (guessState[i] === "_") {
      if (guess[i] in unsolved && unsolved[guess[i]] > 0) {
        guessState[i] = "c";
        unsolved[guess[i]] -= 1;
      }
    }
  }

  nextGameState.guessStates = [
    ...nextGameState.guessStates,
    guessState.join(""),
  ];

  // If this was the final guess, reveal the answer
  if (nextGameState.guessStates.length === 6) {
    nextGameState.revealedAnswer = answer;
  }

  return nextGameState;
}

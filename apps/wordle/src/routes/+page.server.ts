import { fail } from "@sveltejs/kit";
import type { Action, PageServerLoad } from "./$types";
import { checkGuess, loadGameState } from "./game";
import { words } from "./words";

export const load: PageServerLoad = ({ cookies }) => {
  const cookie = cookies.get("wordle");
  const gameState = loadGameState(cookie);

  cookies.set("wordle", JSON.stringify(gameState));

  return {
    state: gameState,
  };
};

export const actions: Record<string, Action> = {
  submit: async ({ request, cookies }) => {
    const cookie = cookies.get("wordle");
    const gameState = loadGameState(cookie);

    const data = await request.formData();
    const guess = data.getAll("guess").join("");

    if (!words.includes(guess)) {
      return fail(400, { badGuess: true });
    }

    const nextGameState = checkGuess(gameState, guess);
    cookies.set("wordle", JSON.stringify(nextGameState));
  },

  restart: async ({ cookies }) => {
    cookies.set("wordle", JSON.stringify(loadGameState()));
  },
};

import Button from "@/components/Button";
import GameMaker from "@/components/GameMaker";
import { Game } from "@/app/types";
import { redirect } from "next/navigation";
import { PARTYKIT_URL } from "./env";
import { splitEmoji } from "@/utils/splitEmoji";

const randomId = () => Math.random().toString(36).substring(2, 10);

const GAME_ID = "123";

export default function Home() {
  async function createPoll(formData: FormData) {
    "use server";
    const emoji = splitEmoji(
      formData.get("emoji")?.toString().trim() ?? ""
    ).filter(Boolean) || ["🍏", "🍎"];

    const game: Game = {
      emoji,
      isStarted: false,
      isEnded: false,
      players: {},
      matches: {},
      completions: {},
    };

    await fetch(`${PARTYKIT_URL}/party/${GAME_ID}`, {
      method: "POST",
      body: JSON.stringify(game),
      headers: {
        "Content-Type": "application/json",
      },
    });

    redirect(`/${GAME_ID}/manage`);
  }

  return (
    <form action={createPoll}>
      <div className="flex flex-col space-y-6">
        <GameMaker />
      </div>
    </form>
  );
}

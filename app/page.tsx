import GameMaker from "@/components/GameMaker";
import { Game } from "@/app/types";
import { redirect } from "next/navigation";
import { PARTYKIT_URL } from "./env";
import { splitEmoji } from "@/utils/splitEmoji";
import { randomId } from "@/utils/randomId";

export default function Home() {
  async function createPoll(formData: FormData) {
    "use server";
    const id = randomId();

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

    await fetch(`${PARTYKIT_URL}/party/${id}`, {
      method: "POST",
      body: JSON.stringify(game),
      headers: {
        "Content-Type": "application/json",
      },
    });

    redirect(`/${id}/manage`);
  }

  return (
    <form action={createPoll}>
      <div className="flex flex-col space-y-6">
        <GameMaker />
      </div>
    </form>
  );
}

import { notFound } from "next/navigation";
import { PARTYKIT_URL } from "@/app/env";
import type { Game } from "@/app/types";
import ManagerUI from "@/components/ManagerUI";

export default async function Managepage({
  params,
}: {
  params: { game_id: string };
}) {
  const gameId = params.game_id;

  const req = await fetch(`${PARTYKIT_URL}/party/${gameId}`, {
    method: "GET",
    next: {
      revalidate: 0,
    },
  });

  if (!req.ok) {
    if (req.status === 404) {
      notFound();
    } else {
      throw new Error("Something went wrong.");
    }
  }

  const game = (await req.json()) as Game;

  return (
    <div className="flex flex-col space-y-4">
      <ManagerUI id={gameId} game={game} />
    </div>
  );
}

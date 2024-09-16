import type * as Party from "partykit/server";

import type { Game } from "@/app/types";

export default class Server implements Party.Server {
  constructor(readonly room: Party.Room) {}

  game: Game | undefined;

  async onStart() {
    this.game = await this.room.storage.get<Game>("game");
  }

  async saveGame() {
    if (this.game) {
      await this.room.storage.put<Game>("game", this.game);
    }
  }

  updateState() {
    this.room.broadcast(JSON.stringify(this.game));
    this.saveGame();
  }

  async onRequest(req: Party.Request) {
    if (req.method === "POST") {
      const game = (await req.json()) as Game;
      this.game = game;
      this.updateState();
    }

    if (this.game) {
      return new Response(JSON.stringify(this.game), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response("Not found", { status: 404 });
  }

  async onMessage(message: string) {
    if (!this.game) return;

    const event = JSON.parse(message);

    if (event.type === "name") {
      this.game.players[event.id] = event.name as string;
      this.updateState();
    }

    if (event.type === "start") {
      this.game.isStarted = true;
      this.updateState();
    }

    if (event.type === "end") {
      this.game.isEnded = true;
      this.updateState();
    }

    if (event.type === "reset") {
      this.game.isStarted = false;
      this.game.isEnded = false;
      this.game.matches = {};
      this.game.completions = {};
      this.updateState();
    }

    if (event.type === "matches") {
      this.game.matches[event.id] = [
        ...(this.game.matches[event.id] ?? []),
        event.emoji as string,
      ];
      this.updateState();
    }

    if (event.type === "completion") {
      this.game.completions[event.id] = event.time as number;
      this.updateState();
    }
  }

  // Remove player when they disconnect
  async onClose(connection: Party.Connection) {
    if (!this.game) return;

    const id = connection.id;
    delete this.game.players[id];
    this.room.broadcast(JSON.stringify(this.game));
    this.saveGame();
  }
}

Server satisfies Party.Worker;

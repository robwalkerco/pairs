"use client";

import { PARTYKIT_HOST } from "@/app/env";
import { Game } from "@/app/types";
import usePartySocket from "partysocket/react";
import { useState } from "react";
import Input from "./Input";
import Button from "./Button";

export default function PlayerUI({ id, game }: { id: string; game: Game }) {
  const [name, setName] = useState("");
  const [currentGame, setCurrentGame] = useState(game);

  const socket = usePartySocket({
    host: PARTYKIT_HOST,
    room: id,
    onMessage(event) {
      const gameData = JSON.parse(event.data) as Game;
      setCurrentGame(gameData);
    },
  });

  const currentMatches = currentGame.matches[socket.id] ?? [];

  const registeredName = currentGame.players[socket.id];
  const isRegistered = Boolean(registeredName);

  const sendName = () => {
    socket.send(JSON.stringify({ type: "name", name, id: socket.id }));
  };

  const sendMatches = (emoji: string) => {
    socket.send(JSON.stringify({ type: "matches", emoji, id: socket.id }));
  };

  const sendCompletion = (time: number) => {
    socket.send(JSON.stringify({ type: "completion", time, id: socket.id }));
  };

  const match = (emoji: string) => {
    sendMatches(emoji);

    if (currentMatches.length + 1 === currentGame.emoji.length) {
      sendCompletion(30);
    }
  };

  return (
    <div className="flex flex-col space-y-6">
      <h1 className="text-2xl font-bold">Match {currentGame.emoji.join("")}</h1>

      {!currentGame.isStarted && !currentGame.isEnded ? (
        <>
          {isRegistered ? (
            <h2 className="text-xl font-bold">
              Hold tight, {registeredName}.The game will start soon!
            </h2>
          ) : (
            <>
              <Input
                placeholder="Your Name"
                type="text"
                name="name"
                className={"text-2xl font-bold"}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <Button onClick={sendName} disabled={!name.length}>
                I&apos;m Ready!
              </Button>
            </>
          )}
        </>
      ) : null}

      {!currentGame.isStarted ? (
        <p className="font-bold">
          There are {Object.keys(currentGame.players).length} players in the
          game.
        </p>
      ) : null}

      {currentGame.isStarted && !currentGame.isEnded && isRegistered ? (
        <ul>
          {currentGame.emoji.map((emoji, index) => (
            <li key={index}>
              {emoji}
              {currentMatches.includes(emoji) ? null : (
                <Button onClick={() => match(emoji)}>Match!</Button>
              )}
            </li>
          ))}
        </ul>
      ) : null}

      {currentGame.isStarted && currentGame.isEnded && isRegistered ? (
        <p className="font-bold">Ended</p>
      ) : null}

      {currentGame.isStarted && !isRegistered ? (
        <p className="font-bold">
          The game is already started. Wait there for the next game
        </p>
      ) : null}
    </div>
  );
}

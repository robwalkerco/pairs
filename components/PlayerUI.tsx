"use client";

import { PARTYKIT_HOST } from "@/app/env";
import { Game } from "@/app/types";
import usePartySocket from "partysocket/react";
import { useCallback, useState } from "react";
import { useStopwatch } from "react-timer-hook";
import Input from "./Input";
import Button from "./Button";
import GameUI from "./GameUI";

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

  const sendMatches = useCallback(
    (emoji: string) => {
      socket.send(JSON.stringify({ type: "matches", emoji, id: socket.id }));
    },
    [socket]
  );

  const sendCompletion = useCallback(
    (time: number) => {
      socket.send(JSON.stringify({ type: "completion", time, id: socket.id }));
    },
    [socket]
  );

  const match = useCallback(
    (emoji: string, time: number) => {
      sendMatches(emoji);

      if (currentMatches.length + 1 === currentGame.emoji.length) {
        sendCompletion(time);
      }
    },
    [
      currentGame.emoji.length,
      currentMatches.length,
      sendCompletion,
      sendMatches,
    ]
  );

  const playersCount = Object.keys(currentGame.players).length;

  return (
    <div className="flex flex-col space-y-6">
      <h1 className="text-2xl font-bold">Match {currentGame.emoji.join("")}</h1>

      {!currentGame.isStarted && !currentGame.isEnded ? (
        <>
          {isRegistered ? (
            <h2 className="text-xl font-bold">
              Hold tight, {registeredName}. The game will start soon!
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
          There are {playersCount} players in the game.
        </p>
      ) : null}

      {currentGame.isStarted && !currentGame.isEnded && isRegistered ? (
        <GameUI
          currentGame={currentGame}
          currentMatches={currentMatches}
          completionTime={currentGame.completions[socket.id]}
          match={match}
        />
      ) : null}

      {currentGame.isStarted && currentGame.isEnded && isRegistered ? (
        <>
          <h2 className="text-xl font-bold">Game over!</h2>
          {currentMatches.length === currentGame.emoji.length ? (
            <h3 className="text-2xl font-bold">
              You completed all the pairs in{" "}
              {currentGame.completions[socket.id]} seconds!
            </h3>
          ) : (
            <h3 className="text-2xl font-bold">
              You matched {currentMatches.length} of the{" "}
              {currentGame.emoji.length} pairs.
            </h3>
          )}
        </>
      ) : null}

      {currentGame.isStarted && !isRegistered ? (
        <p className="font-bold">
          The game is already started. Wait there for the next game
        </p>
      ) : null}
    </div>
  );
}

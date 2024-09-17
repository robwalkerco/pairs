"use client";

import { useState } from "react";
import usePartySocket from "partysocket/react";
import QRCode from "react-qr-code";
import { PARTYKIT_HOST } from "@/app/env";
import { Game } from "@/app/types";
import Button from "./Button";

export default function ManagerUI({ id, game }: { id: string; game: Game }) {
  const [currentGame, setCurrentGame] = useState(game);

  const socket = usePartySocket({
    host: PARTYKIT_HOST,
    room: id,
    onMessage(event) {
      const gameData = JSON.parse(event.data) as Game;
      setCurrentGame(gameData);
    },
  });

  const send = (type: "start" | "end" | "reset") => () => {
    socket.send(JSON.stringify({ type }));
  };

  return (
    <div className="flex justify-between">
      <div className="flex flex-col ">
        <h1 className="text-2xl font-bold">
          Match {currentGame.emoji.join("")}
        </h1>

        {currentGame.isEnded ? (
          <h2 className="text-1xl font-bold">Game Over</h2>
        ) : null}

        <h2 className="text-1xl font-bold">
          {Object.keys(currentGame.players).length} Players
        </h2>

        <div className="space-y-4">
          <ul className="space-y-1">
            {Object.keys(currentGame.players)
              .sort((a, b) => {
                const aTime = currentGame.completions[a];
                const aCount = (currentGame.matches[a] ?? []).length;
                const bTime = currentGame.completions[b];
                const bCount = (currentGame.matches[b] ?? []).length;

                if (
                  typeof aTime !== undefined &&
                  (typeof bTime === undefined || aTime < bTime)
                ) {
                  return -1;
                }

                return bCount - aCount;
              })
              .map((id) => {
                const matchesCount = (currentGame.matches[id] ?? []).length;
                const progressPercentage = Math.floor(
                  (matchesCount / currentGame.emoji.length) * 100
                );

                return (
                  <li
                    key={id}
                    className={`border-2 rounded p-2 `}
                    style={{
                      backgroundImage: `linear-gradient(to right, rgb(199, 210, 254) ${progressPercentage}%, rgba(0, 0, 0, 0) ${progressPercentage}%)`,
                    }}
                  >
                    {currentGame.players[id]} -{" "}
                    {typeof currentGame.completions[id] !== "undefined"
                      ? `Completed in ${currentGame.completions[id]} seconds`
                      : `${matchesCount}/${currentGame.emoji.length}`}
                  </li>
                );
              })}
          </ul>

          {currentGame.isStarted && currentGame.isEnded ? (
            <Button onClick={send("reset")}>Reset game!</Button>
          ) : null}

          {!currentGame.isStarted && !currentGame.isEnded ? (
            <Button
              onClick={send("start")}
              disabled={Object.keys(currentGame.players).length === 0}
            >
              Start game!
            </Button>
          ) : null}

          {currentGame.isStarted && !currentGame.isEnded ? (
            <Button onClick={send("end")}>End game</Button>
          ) : null}
        </div>
      </div>

      {!currentGame.isStarted ? (
        <a href={`${new URL(window.location.href)}/${id}/play`} target="_blank">
          <QRCode
            className="flex flex-col"
            value={`${new URL(window.location.href)}/${id}/play`}
          />
          <p className="text-2xl font-bold mt-4">👆 Scan to join game 👆</p>
        </a>
      ) : null}
    </div>
  );
}

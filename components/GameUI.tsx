"use client";

import { useStopwatch } from "react-timer-hook";
import { Game } from "@/app/types";
import { useEffect, useState } from "react";
import { randomId } from "@/utils/randomId";

type Card = { emoji: string; id: string };

export default function GameUI({
  currentGame,
  currentMatches,
  completionTime,
  match,
}: {
  currentGame: Game;
  currentMatches: string[];
  completionTime: undefined | number;
  match: (emoji: string, time: number) => void;
}) {
  const { totalSeconds } = useStopwatch({ autoStart: true });
  const [cards] = useState<Card[]>(
    [...currentGame.emoji, ...currentGame.emoji]
      .sort(() => Math.random() - 0.5)
      .map((emoji) => ({ emoji, id: randomId() }))
  );
  const [selectionOne, setSelectionOne] = useState<Card | null>(null);
  const [selectionTwo, setSelectionTwo] = useState<Card | null>(null);
  const [disabled, setDisabled] = useState(false);

  const reset = () => {
    setSelectionOne(null);
    setSelectionTwo(null);
    setDisabled(false);
  };

  useEffect(() => {
    if (selectionOne && selectionOne.emoji === selectionTwo?.emoji) {
      match(selectionOne.emoji, totalSeconds);
      reset();
    } else if (selectionOne && selectionTwo) {
      setTimeout(reset, 1000);
    }
  }, [selectionOne, selectionTwo]);

  const handleSelection = (card: Card) => {
    if (!selectionOne) {
      setSelectionOne(card);
    } else {
      setDisabled(true);
      setSelectionTwo(card);
    }
  };

  if (typeof completionTime !== "undefined") {
    return (
      <div className="flex flex-col space-y-6">
        <h2 className="text-xl font-bold">
          Congratulations! You matched all the pairs in {completionTime}{" "}
          seconds.
        </h2>
      </div>
    );
  }

  return (
    <div>
      <p className="font-bold">Time = {totalSeconds} seconds</p>
      <div className="grid grid-cols-4 gap-4">
        {cards.map((card, index) => {
          if (currentMatches.includes(card.emoji)) {
            return (
              <div
                key={index}
                className="text-2xl border rounded-xl p-2 m-2 cursor-not-allowed justify-center flex"
              >
                ✅
              </div>
            );
          }

          if (selectionOne?.id === card.id || selectionTwo?.id === card.id) {
            return (
              <div
                key={index}
                className="text-2xl border rounded-xl p-2 m-2 cursor-pointer justify-center flex"
                onClick={disabled ? undefined : () => handleSelection(card)}
              >
                {card.emoji}
              </div>
            );
          }

          return (
            <div>
              {selectionOne?.id === card.id ||
              selectionTwo?.id === card.id ? null : (
                <div
                  key={index}
                  className={`text-2xl border rounded-xl p-2 m-2 justify-center flex ${
                    disabled ? "cursor-not-allowed" : "cursor-pointer"
                  }`}
                  onClick={disabled ? undefined : () => handleSelection(card)}
                >
                  ❓
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

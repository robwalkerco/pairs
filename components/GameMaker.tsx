"use client";

import { useState } from "react";
import Button from "./Button";
import Input from "./Input";

const MIN_OPTIONS = 2;

const EMOJI = "🍏🍊🍉🍓🍒🍑";

export default function GameMaker() {
  const [emoji, setEmoji] = useState(EMOJI);

  const canSubmit =
    emoji.trim().split("").filter(Boolean).length >= MIN_OPTIONS;

  return (
    <>
      <h1 className="text-2xl font-bold">Create a new Pairs game</h1>

      <fieldset>
        <label className="text-xl" htmlFor="emoji">
          What emojis would you like to use?
        </label>

        <Input
          placeholder="Emojis"
          type="text"
          name="emoji"
          className={"text-2xl font-bold"}
          value={emoji}
          onChange={(e) => setEmoji(e.target.value)}
        />
      </fieldset>

      <Button type="submit" disabled={!canSubmit}>
        Create Game
      </Button>
    </>
  );
}

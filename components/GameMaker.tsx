"use client";

import { useRef, useState } from "react";
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
      <Input
        placeholder="Emojis"
        type="text"
        name="emoji"
        className={"text-2xl font-bold"}
        value={emoji}
        onChange={(e) => setEmoji(e.target.value)}
      />

      <Button type="submit" disabled={!canSubmit}>
        Create Game
      </Button>
    </>
  );
}

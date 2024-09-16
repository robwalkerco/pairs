export type Game = {
  emoji: string[];
  isStarted: boolean;
  isEnded: boolean;
  players: { [id: string]: string };
  matches: { [playerId: string]: string[] };
  completions: { [playerId: string]: number };
};

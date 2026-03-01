export type GameType = "Hangman" | "Trivia" | "Memotest";

export interface Game {
  id: string;
  title: string;
  description: string;
  type: GameType;
  level: string;
  createdAt: string;
  teacherId: string;
  content: string; 
}

export interface CreateGameRequest {
  title: string;
  description: string;
  type: GameType;
  level: string;
  content: string;
}

export interface HangmanContent {
  words: string[];
  category: string;
}
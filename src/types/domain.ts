export interface GameData {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  type: "memotest" | "ahorcadito" | "trivia";
}

export interface ClassRoom {
  id: number;
  name: string;
  professorName: string;
  imageUrl: string;
  games: GameData[];
}

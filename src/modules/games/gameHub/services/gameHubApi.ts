import { instance } from "../../../../shared/api/axiosInstance";
const gamesApi = `api/games`;

export type GameDifficulty = "Fácil" | "Medio" | "Difícil";

export interface GameInstance {
  id: string;
  title: string;
  description: string;
  type: string;
  difficulty: GameDifficulty;
  imageUrl: string;
  course?: string;
  division?: string;
  assignedClass?: string;
}

function normalizeList<T>(data: any): T[] {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (data.$values && Array.isArray(data.$values)) return data.$values;
  return [];
}

export const getRealHangmanGames = async (hangmanImageUrl: string): Promise<GameInstance[]> => {
  try {
    const response = await instance.get(gamesApi);
    const rawGames = normalizeList<any>(response.data);

    return rawGames.map((game: any) => {
      const spec = game.gameSpecification || game.GameSpecification || {};
      
      return {
        id: String(game.id || game.Id || ""),
        title: spec.title || spec.Title || "Sin título",
        description: spec.description || spec.Description || "Sin descripción",
        type: "Ahorcadito",
        difficulty: (game.difficulty || game.Difficulty || "Medio") as GameDifficulty,
        imageUrl: hangmanImageUrl,
      };
    }).filter(game => game.id); 
  } catch (error) {
    console.error("Error en getRealHangmanGames:", error);
    throw error;
  }
};
import { instance } from "../../../../shared/api/axiosInstance";

const hangmanApi = `api/games/hangman`;
const gamesApi = `api/games`;
const classroomApi = `api/classroom`;

export interface Word {
  id: string;
  text: string;
  hint: string;
  level: number;
  topicId: string;
}

export interface Topic {
  id: string;
  name: string;
  description: string;
}

export interface HangmanResponse {
  maskedWord: string;
  attempt: "Hit" | "Missed" | "Used";
  gameResult: "Won" | "Lost" | "Continue"; 
  currentAttempts: number;
}

export interface GameMetadata {
  id: string;
  title: string;
  description: string;
  instructions: string;
}

export interface GameInitResponse {
  maskedWord: string;
  metadata: GameMetadata;
}

function normalizeList<T>(data: any): T[] {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (data.$values && Array.isArray(data.$values)) return data.$values;
  return [];
}

const GAME_RESULT_MAP: Record<number, HangmanResponse["gameResult"]> = {
  0: "Won",
  1: "Lost",
  2: "Continue",
};

const ATTEMPT_MAP: Record<number, HangmanResponse["attempt"]> = {
  0: "Hit",
  1: "Missed",
  2: "Used",
};

function resolveEnum<T extends string>(
  value: any,
  map: Record<number, T>,
  fallback: T
): T {
  if (typeof value === "string" && value.length > 0) return value as T;
  if (typeof value === "number" && map[value] !== undefined) return map[value];
  return fallback;
}


export const createWord = async (wordData: {
  text: string;
  hint: string;
  level: number;
  topicId: string;
}): Promise<string> => {
  const response = await instance.post(`${hangmanApi}/words`, wordData);
  return response.data;
};

export const getWords = async (params: {
  topicId?: string;
  difficulty?: string | number;
}): Promise<Word[]> => {
  let level = params.difficulty;
  if (level === "EASY") level = 0;
  if (level === "MEDIUM") level = 1;
  if (level === "HARD") level = 2;

  const url = params.topicId
    ? `${hangmanApi}/words/${params.topicId}`
    : `${hangmanApi}/words`;

  const response = await instance.get(url, { params: { level } });
  return normalizeList<Word>(response.data);
};

//gestion de topicos

export const getTopics = async (): Promise<Topic[]> => {
  const response = await instance.get(`${classroomApi}/topics`);
  return normalizeList<Topic>(response.data);
};

export const createTopic = async (name: string, description: string = ""): Promise<Topic> => {
  const response = await instance.post(`${classroomApi}/topic`, { name, description });
  return response.data;
};

export const startGame = async (gameId: string): Promise<GameInitResponse> => {
  const [wordRes, metaRes] = await Promise.all([
    instance.post(`${hangmanApi}/${gameId}`),
    instance.get(`${gamesApi}/${gameId}`),
  ]);
  const { maskedWord, hint } = wordRes.data;
  const d = metaRes.data;

  return {
    maskedWord: maskedWord || "",
    metadata: {
      id: d.id ?? d.Id ?? "",
      title: d.title ?? d.Title ?? "AHORCADO",
      description: d.description ?? d.Description ?? "",
      instructions: hint ?? d.instructions ?? d.Instructions ?? d.description ?? d.Description ?? "",
    },
  };
};

export const playTurn = async (gameId: string, letter: string): Promise<HangmanResponse> => {
  const response = await instance.put(`${hangmanApi}/${gameId}`, { letter });
  const d = response.data;

  const gameResult = resolveEnum(
    d.gameResult ?? d.GameResult,
    GAME_RESULT_MAP,
    "Continue"
  );

  const attempt = resolveEnum(
    d.attempt ?? d.Attempt,
    ATTEMPT_MAP,
    "Missed"
  );

  return {
    maskedWord: d.maskedWord ?? d.MaskedWord ?? "",
    attempt,
    gameResult,
    currentAttempts: d.currentAttempts ?? d.CurrentAttempts ?? d.currentAttempt ?? d.CurrentAttempt ?? 0,
  };
};

export const createHangmanGame = async (payload: any): Promise<any> => {
  const response = await instance.post(`${hangmanApi}`, payload);
  return response.data;
};

export const publishGameToClassroom = async (
  classId: string,
  gameId: string,
  topicId: string
): Promise<any> => {
  const payload = { gameId, topicId };
  const response = await instance.post(`${classroomApi}/${classId}/publish-game`, payload);
  return response.data;
};

export const saveAhorcaditoGame = async (payload: any): Promise<any> => {
  const { selectedClassId, gameId, topicId } = payload;
  if (!selectedClassId) throw new Error("ID de clase no proporcionado.");
  return publishGameToClassroom(selectedClassId, gameId, topicId);
};

export const getTeacherGames = async (): Promise<any[]> => {
  const response = await instance.get(gamesApi);
  return normalizeList<any>(response.data);
};
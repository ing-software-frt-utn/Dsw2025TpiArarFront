import { useState, useEffect, useCallback } from "react";
import { instance } from "../../../../shared/api/axiosInstance";

export interface HangmanResponse {
  maskedWord: string;
  attempt: "Hit" | "Missed" | "Used";
  gameResult: "Won" | "Lost" | "Playing";
  currentAttempts: number;
}

export interface GameMetadata {
  id: string;
  title: string;
  description: string;
  instructions: string;
}

export interface Topic {
  id: string;
  name: string;
  description: string;
}

export const useAhorcadito = (gameId?: string) => {
  // --- Estados de la Partida ---
  const [maskedWord, setMaskedWord] = useState<string>("");
  const [guessedLetters, setGuessedLetters] = useState<string[]>([]);
  const [mistakes, setMistakes] = useState<number>(0);
  const [metadata, setMetadata] = useState<GameMetadata | null>(null);
  const [status, setStatus] = useState<"Playing" | "Won" | "Lost">("Playing");

  // --- Estados Globales / Creador ---
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // --- Estados del Cronómetro ---
  const [timeElapsed, setTimeElapsed] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  // --- Lógica de Tópicos (Para el Creador) ---
  const fetchTopics = useCallback(async () => {
    try {
      const response = await instance.get("api/classroom/topics");
      // Manejamos la normalización por si el back manda $values
      setTopics(Array.isArray(response.data) ? response.data : response.data?.$values || []);
    } catch (err: any) {
      console.error("Error al traer tópicos:", err);
    }
  }, []);

  const createTopic = async (name: string, description: string = "") => {
    try {
      const response = await instance.post("api/classroom/topic", { name, description });
      const newTopic = response.data;
      setTopics((prev) => [...prev, newTopic]);
      return newTopic;
    } catch (err: any) {
      throw new Error(err.response?.data?.message || "No se pudo crear el tópico");
    }
  };

  // --- Lógica de Juego (Para el Alumno) ---
  const initGame = useCallback(async () => {
    if (!gameId) return;
    try {
      setLoading(true);
      setError(null);
      
      const [wordRes, metaRes] = await Promise.all([
        instance.post(`api/games/hangman/${gameId}`),
        instance.get(`api/games/${gameId}`)
      ]);
      
      const d = metaRes.data;
      setMaskedWord(wordRes.data);
      setMetadata({
        id: d.id || d.Id,
        title: d.title || d.Title,
        description: d.description || d.Description,
        instructions: d.instructions || d.Instructions
      });
      
      setMistakes(0);
      setGuessedLetters([]);
      setStatus("Playing");
      setTimeElapsed(0);
      setIsTimerRunning(true);
    } catch (err: any) {
      setError("No se pudo iniciar la partida. Verifica la conexión.");
      setIsTimerRunning(false);
    } finally {
      setLoading(false);
    }
  }, [gameId]);

  const guessLetter = async (letter: string) => {
    if (status !== "Playing" || !gameId || guessedLetters.includes(letter)) return;

    setGuessedLetters((prev) => [...prev, letter]);

    try {
      const response = await instance.put(`api/games/hangman/${gameId}`, { letter });
      const d = response.data;
      
      const result: HangmanResponse = {
        maskedWord: d.maskedWord || d.MaskedWord,
        attempt: d.attempt || d.Attempt,
        gameResult: d.gameResult || d.GameResult,
        currentAttempts: d.currentAttempts ?? d.CurrentAttempts ?? 0
      };

      setMaskedWord(result.maskedWord);
      setMistakes(result.currentAttempts);

      if (result.gameResult === "Won") {
        setStatus("Won");
        setIsTimerRunning(false);
      } else if (result.gameResult === "Lost") {
        setStatus("Lost");
        setIsTimerRunning(false);
      }
    } catch (err: any) {
      console.error("Error en la jugada:", err);
    }
  };

  // --- Efectos ---
  useEffect(() => {
    let interval: any;
    if (isTimerRunning) {
      interval = setInterval(() => setTimeElapsed((prev) => prev + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  useEffect(() => {
    if (gameId) initGame();
    fetchTopics();
  }, [gameId, initGame, fetchTopics]);

  return {
    maskedWord,
    guessedLetters,
    mistakes,
    metadata,
    topics,
    loading,
    error,
    status,
    timeElapsed,
    guessLetter,
    createTopic,
    fetchTopics,
    resetGame: initGame
  };
};

export default useAhorcadito;
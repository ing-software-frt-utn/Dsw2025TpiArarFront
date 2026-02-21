import { instance } from "../../../../shared/api/axiosInstance";
import { MOCK_HANGMAN_DATA } from "./mockHangman";

export interface HangmanEvent {
  type: "LetterHitEvent" | "LetterMissedEvent" | "GameWonEvent" | "GameLostEvent";
  letter?: string;
  maskedWord: string; 
}

export interface GameInitResponse {
  id: string;
  title: string;
  description: string;
  hint: string;
  remainingAttempts: number;
  status: string;
  maskedWord?: string; 
}

/*
// codigo que se usara cuando funque correctamente el back end

export const startGame = async (gameId: string): Promise<GameInitResponse> => {
  try {
    await instance.post(`/games/hangman/${gameId}`);

    const gameInfoRes = await instance.get(`/games/${gameId}`);
    const gameInfo = gameInfoRes.data;

    const wordRes = await instance.get(`/games/hangman/${gameId}/masked-word`);
    const initialMaskedWord = wordRes.data; 

    return {
      id: gameInfo.id || gameId,
      title: gameInfo.title || "Ahorcado",
      description: gameInfo.description || "",
      hint: gameInfo.instructions || "Sin pistas", 
      remainingAttempts: 6, 
      status: "Started",
      maskedWord: initialMaskedWord 
    };
  } catch (error) {
    throw error;
  }
};

export const playTurn = async (gameId: string, letter: string): Promise<HangmanEvent[]> => {
  const { data } = await instance.put<HangmanEvent[]>(`/games/hangman/${gameId}/${letter}`);
  return data;
};
*/

// --- Mock temporal para testear UI ---

// Variables para mantener el estado de la simulación en memoria
let mockGuessedLetters: string[] = [];

export const startGame = async (gameId: string): Promise<GameInitResponse> => {
  await new Promise((r) => setTimeout(r, 500));

  // Reseteo la memoria del mock al iniciar juego
  mockGuessedLetters = [];

  // Creo la máscara inicial con guiones (ej: "_ _ _ _ _ _ _ _ _")
  const initialMasked = MOCK_HANGMAN_DATA.targetWord.split('').map(() => '_').join(' ');

  return {
    id: gameId,
    title: "Ahorcado de Prueba",
    description: "Modo simulación activado",
    hint: MOCK_HANGMAN_DATA.hint, 
    remainingAttempts: 6,
    status: "Started",
    maskedWord: initialMasked
  };
};

export const playTurn = async (gameId: string, letter: string): Promise<HangmanEvent[]> => {
  await new Promise((r) => setTimeout(r, 300));

  const upperLetter = letter.toUpperCase();
  const targetWord = MOCK_HANGMAN_DATA.targetWord;
  
  // Guardo la letra en la memoria del mock
  if (!mockGuessedLetters.includes(upperLetter)) {
    mockGuessedLetters.push(upperLetter);
  }

  // Calculo com se ve la palabra ahora
  const currentMaskedWord = targetWord.split('')
    .map(char => mockGuessedLetters.includes(char) ? char : '_')
    .join(' ');

  const events: HangmanEvent[] = [];

  if (targetWord.includes(upperLetter)) {
    //Si acerto el flaco, agrego evento de acierto con la palabra actualizada
    events.push({ 
      type: "LetterHitEvent", 
      letter: upperLetter, 
      maskedWord: currentMaskedWord 
    });

    // 2. Verifico si ya completó toda la palabra (no quedan guiones)
    if (!currentMaskedWord.includes('_')) {
      events.push({ 
        type: "GameWonEvent", 
        maskedWord: currentMaskedWord 
      });
    }
  } else {
    // Si erró
    events.push({ 
      type: "LetterMissedEvent", 
      letter: upperLetter, 
      maskedWord: currentMaskedWord 
    });
  }

  return events;
};
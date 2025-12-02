import { ClassRoom } from "./types/domain";

export const mockClasses: ClassRoom[] = [
  {
    id: 1,
    name: "Matematicas",
    professorName: "Cesar Delgado",
    imageUrl: "https://cdn-icons-png.flaticon.com/512/2232/2232688.png",
    games: [
      {
        id: 1,
        title: "Memotest",
        description: "Un juego de memoria",
        imageUrl: "https://cdn-icons-png.flaticon.com/512/3965/3965108.png",
        type: "memotest",
      },
      {
        id: 2,
        title: "Ahorcadito",
        description: "Un juego de ahorcado",
        imageUrl: "https://cdn-icons-png.flaticon.com/512/10609/10609019.png",
        type: "ahorcadito",
      },
    ],
  },
  {
    id: 2,
    name: "Lengua",
    professorName: "Luciano dotnet",
    imageUrl: "https://cdn-icons-png.flaticon.com/512/2232/2232688.png",
    games: [
      {
        id: 3,
        title: "Trivia",
        description: "Un juego de trivia",
        imageUrl: "https://cdn-icons-png.flaticon.com/512/10608/10608892.png",
        type: "trivia",
      },
    ],
  },
];

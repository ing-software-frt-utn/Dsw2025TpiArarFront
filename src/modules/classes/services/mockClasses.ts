

export interface MockClass {
  id: string;
  name: string;
  description: string;
}

export const mockStudentClasses: MockClass[] = [
  {
    id: "01",
    name: "Matemáticas",
    description: "2do-A" 
  },
  {
    id: "02",
    name: "Lengua",
    description: "3ro-B"
  }
];

export const mockClassroomDetails: Record<string, any> = {
  "01": {
    classroom: {
      id: "01",
      name: "Matemáticas",
      description: "2do-A"
    },
    games: [
      {
        id: "m1",
        gameId: "1", 
        title: "Memotest Matemático",
        description: "Encontrá los pares de números y operaciones.",
        type: "memotest",
        topicName: "Cálculo Mental",
        level: "Fácil"
      }
    ]
  },
  "02": {
    classroom: {
      id: "02",
      name: "Lengua",
      description: "3ro-B"
    },
    games: [
      {
        id: "t1",
        gameId: "3", 
        title: "Trivia Literaria",
        description: "Respondé preguntas sobre gramática y literatura.",
        type: "trivia",
        topicName: "Gramática",
        level: "Media"
      }
    ]
  }
};
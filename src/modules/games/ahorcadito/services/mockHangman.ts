const MATH_MOCKS = [
  {
    targetWord: "ALGORITMO",
    hint: "Conjunto ordenado de operaciones sistemáticas",
  },
  {
    targetWord: "ALGEBRA",
    hint: "Rama de la matemática que usa letras para representar números",
  },
  {
    targetWord: "GEOMETRIA",
    hint: "Estudio de las propiedades y medidas de las figuras",
  },
  {
    targetWord: "ECUACION",
    hint: "Igualdad entre dos expresiones que contiene una o más variables",
  },
  {
    targetWord: "DERIVADA",
    hint: "Medida de la rapidez con la que cambia el valor de una función",
  },
  {
    targetWord: "INTEGRAL",
    hint: "Concepto fundamental del cálculo, inverso a la derivada",
  },
  {
    targetWord: "HIPOTENUSA",
    hint: "Lado opuesto al ángulo recto en un triángulo rectángulo",
  },
  {
    targetWord: "POLINOMIO",
    hint: "Expresión algebraica formada por la suma de varios monomios",
  },
  {
    targetWord: "MATRIZ",
    hint: "Conjunto bidimensional de números organizados en filas y columnas",
  },
  {
    targetWord: "LOGARITMO",
    hint: "Exponente al que hay que elevar una base para obtener un número",
  },
  {
    targetWord: "FACTORIAL",
    hint: "Producto de todos los números enteros positivos desde 1 hasta n",
  },
  {
    targetWord: "PROMEDIO",
    hint: "Valor característico de una serie de datos (media aritmética)",
  },
  {
    targetWord: "MEDIANA",
    hint: "Valor que ocupa el lugar central de todos los datos ordenados",
    },
    {
    targetWord: "COCIENTE",
    hint: "Resultado de una división",
    },
    {
    targetWord: "INCÓGNITA",
    hint: "Valor desconocido en una ecuación",
    }
];

// Selecciona una palabra aleatoria de la lista
export const MOCK_HANGMAN_DATA = MATH_MOCKS[Math.floor(Math.random() * MATH_MOCKS.length)];
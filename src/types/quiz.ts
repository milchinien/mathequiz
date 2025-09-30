export interface Answer {
  Antwort: string;
  Richtig: boolean;
  Kommentar: string;
}

export interface Question {
  Frage: string;
  Typ: "SingleAnswer" | "MultipleAnswer";
  Antworten: Answer[];
}

export interface Quiz {
  Thema: string;
  Fragen: Question[];
  PoolConfig?: {
    poolSize: number;          // Total questions in pool
    questionsPerGame: number;  // Questions to select per game
  };
}

export interface QuizStructure {
  [category: string]: {
    [subcategory: string]: string[];
  };
}

export interface QuizMode {
  mode: "immediate" | "summary";
}

export interface UserAnswer {
  questionIndex: number;
  selectedAnswers: number[];
  isCorrect?: boolean;
}

export interface QuizResult {
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  userAnswers: UserAnswer[];
}
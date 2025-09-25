export interface User {
  name: string;
  lastUsed: string; // ISO date string
}

export interface UserSession {
  username: string;
  loginTime: string;
  expiresAt: string;
}

export interface QuizSession {
  id: string;
  user: string;
  timestamp: string; // ISO date string
  quiz: {
    category: string;
    subcategory: string;
    name: string;
    path: string[];
  };
  questions: SessionQuestion[];
  score: {
    correct: number;
    total: number;
    percentage: number;
  };
  mode: 'immediate' | 'summary';
  duration?: number; // in seconds
}

export interface SessionQuestion {
  question: string;
  type: 'SingleAnswer' | 'MultipleAnswer';
  userAnswers: string[];
  correctAnswers: string[];
  isCorrect: boolean;
  originalIndex: number;
}
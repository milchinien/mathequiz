'use client';

import { useState, useEffect, useMemo } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { Quiz, UserAnswer, Question } from '@/types/quiz';
import QuizQuestion from '@/components/QuizQuestion';
import QuizResults from '@/components/QuizResults';
import Link from 'next/link';

interface ShuffledQuestion extends Question {
  originalIndex: number;
}

export default function QuizPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const mode = (searchParams.get('mode') as 'immediate' | 'summary') || 'immediate';
  const [showResults, setShowResults] = useState(false);

  // Shuffle questions once when quiz is loaded
  const shuffledQuestions = useMemo<ShuffledQuestion[]>(() => {
    if (!quiz?.Fragen) return [];

    const questionsWithIndex = quiz.Fragen.map((question, index) => ({
      ...question,
      originalIndex: index
    }));

    // Fisher-Yates shuffle algorithm
    const shuffled = [...questionsWithIndex];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled;
  }, [quiz]);

  useEffect(() => {
    if (params.path) {
      fetchQuiz();
    }
  }, [params.path]);

  const fetchQuiz = async () => {
    try {
      const pathArray = Array.isArray(params.path) ? params.path : [params.path];
      const response = await fetch(`/api/quiz/${pathArray.join('/')}`);

      if (!response.ok) {
        throw new Error('Failed to load quiz');
      }

      const data = await response.json();
      setQuiz(data);
      setLoading(false);
    } catch (err) {
      setError('Quiz konnte nicht geladen werden');
      setLoading(false);
    }
  };

  const handleAnswer = (selectedAnswers: number[], isCorrect: boolean, feedbackMessage?: string) => {
    // Store the original question index for results tracking
    const originalQuestionIndex = shuffledQuestions[currentQuestionIndex]?.originalIndex ?? currentQuestionIndex;

    const newAnswer: UserAnswer = {
      questionIndex: originalQuestionIndex, // Use original index for results consistency
      selectedAnswers,
      isCorrect
    };

    setUserAnswers([...userAnswers, newAnswer]);

    if (mode === 'summary') {
      setTimeout(() => {
        handleNext();
      }, 300);
    } else if (mode === 'immediate') {
      // Wait for toast to be visible before moving to next question
      setTimeout(() => {
        handleNext();
      }, 3000);
    }
  };

  const handleNext = () => {
    if (!shuffledQuestions.length) return;

    if (currentQuestionIndex < shuffledQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setShowResults(true);
    }
  };

  const calculateCorrectCount = () => {
    return userAnswers.filter(answer => answer.isCorrect).length;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-xl text-gray-900 dark:text-gray-100">Lade Quiz...</div>
      </div>
    );
  }

  if (error || !quiz) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl text-red-600 dark:text-red-400 mb-4">{error || 'Quiz nicht gefunden'}</div>
          <Link href="/" className="text-blue-600 dark:text-blue-400 hover:underline">
            Zurück zur Übersicht
          </Link>
        </div>
      </div>
    );
  }

  if (showResults) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 py-8">
        <QuizResults
          quiz={quiz}
          userAnswers={userAnswers}
          correctCount={calculateCorrectCount()}
          totalQuestions={shuffledQuestions.length}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-6">
          <Link href="/" className="text-blue-600 dark:text-blue-400 hover:underline">
            ← Zurück zur Übersicht
          </Link>
        </div>

        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{quiz.Thema}</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Modus: {mode === 'immediate' ? 'Sofort-Feedback' : 'Zusammenfassung am Ende'}
          </p>
        </div>

        <QuizQuestion
          question={shuffledQuestions[currentQuestionIndex]}
          questionNumber={currentQuestionIndex + 1}
          totalQuestions={shuffledQuestions.length}
          mode={mode}
          onAnswer={handleAnswer}
          onNext={handleNext}
          isLastQuestion={currentQuestionIndex === shuffledQuestions.length - 1}
        />
      </div>
    </div>
  );
}
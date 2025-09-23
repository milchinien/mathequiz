'use client';

import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { Quiz, UserAnswer } from '@/types/quiz';
import QuizQuestion from '@/components/QuizQuestion';
import QuizResults from '@/components/QuizResults';
import Link from 'next/link';

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
    const newAnswer: UserAnswer = {
      questionIndex: currentQuestionIndex,
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
    if (!quiz) return;

    if (currentQuestionIndex < quiz.Fragen.length - 1) {
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
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <div className="text-xl">Lade Quiz...</div>
      </div>
    );
  }

  if (error || !quiz) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl text-red-600 mb-4">{error || 'Quiz nicht gefunden'}</div>
          <Link href="/" className="text-blue-600 hover:underline">
            Zurück zur Übersicht
          </Link>
        </div>
      </div>
    );
  }

  if (showResults) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-8">
        <QuizResults
          quiz={quiz}
          userAnswers={userAnswers}
          correctCount={calculateCorrectCount()}
          totalQuestions={quiz.Fragen.length}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-6">
          <Link href="/" className="text-blue-600 hover:underline">
            ← Zurück zur Übersicht
          </Link>
        </div>

        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold">{quiz.Thema}</h1>
          <p className="text-sm text-gray-600 mt-2">
            Modus: {mode === 'immediate' ? 'Sofort-Feedback' : 'Zusammenfassung am Ende'}
          </p>
        </div>

        <QuizQuestion
          question={quiz.Fragen[currentQuestionIndex]}
          questionNumber={currentQuestionIndex + 1}
          totalQuestions={quiz.Fragen.length}
          mode={mode}
          onAnswer={handleAnswer}
          onNext={handleNext}
          isLastQuestion={currentQuestionIndex === quiz.Fragen.length - 1}
        />
      </div>
    </div>
  );
}
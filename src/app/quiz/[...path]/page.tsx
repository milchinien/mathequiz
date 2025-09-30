'use client';

import { useState, useEffect, useMemo, Suspense } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { Quiz, UserAnswer, Question } from '@/types/quiz';
import { QuizSession, SessionQuestion } from '@/types/user';
import { useHistory, generateSessionId } from '@/contexts/HistoryContext';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';
import QuizQuestion from '@/components/QuizQuestion';
import QuizResults from '@/components/QuizResults';
import Link from 'next/link';

interface ShuffledQuestion extends Question {
  originalIndex: number;
}

function QuizContent() {
  const { isAuthenticated, currentUser, isLoading } = useProtectedRoute();
  const params = useParams();
  const searchParams = useSearchParams();
  const { addSession } = useHistory();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const mode = (searchParams.get('mode') as 'immediate' | 'summary') || 'immediate';
  const [showResults, setShowResults] = useState(false);
  const [sessionId] = useState(() => generateSessionId());
  const [sessionStartTime] = useState(() => new Date());

  // Shuffle questions and select subset from pool if configured
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

    // If pool is configured, select only questionsPerGame from the shuffled pool
    if (quiz.PoolConfig && quiz.PoolConfig.questionsPerGame < shuffled.length) {
      return shuffled.slice(0, quiz.PoolConfig.questionsPerGame);
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
      const pathArray: string[] = Array.isArray(params.path) 
      ? params.path.filter((p): p is string => Boolean(p))
      : params.path ? [params.path] : [];
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
      // Quiz completed - show results (session will be saved by useEffect)
      setShowResults(true);
    }
  };

  // Save session when showing results and userAnswers is complete
  const [sessionSaved, setSessionSaved] = useState(false);

  useEffect(() => {
    if (showResults && userAnswers.length === shuffledQuestions.length && shuffledQuestions.length > 0 && !sessionSaved) {
      // Create session with current userAnswers state
      const sessionEndTime = new Date();
      const duration = Math.round((sessionEndTime.getTime() - sessionStartTime.getTime()) / 1000);
      const pathArray: string[] = Array.isArray(params.path) 
      ? params.path.filter((p): p is string => Boolean(p))
      : params.path ? [params.path] : [];

      if (!currentUser || !quiz) return;

      const sessionQuestions: SessionQuestion[] = userAnswers.map(answer => {
        const originalQuestion = quiz.Fragen[answer.questionIndex];
        const userAnswerTexts = answer.selectedAnswers.map(index =>
          originalQuestion.Antworten[index]?.Antwort || 'Unbekannte Antwort'
        );
        const correctAnswerTexts = originalQuestion.Antworten
          .filter(ans => ans.Richtig)
          .map(ans => ans.Antwort);

        return {
          question: originalQuestion.Frage,
          type: originalQuestion.Typ,
          userAnswers: userAnswerTexts,
          correctAnswers: correctAnswerTexts,
          isCorrect: !!answer.isCorrect,
          originalIndex: answer.questionIndex
        };
      });

      const correctCount = userAnswers.filter(answer => answer.isCorrect).length;
      const total = shuffledQuestions.length;

      const session: QuizSession = {
        id: sessionId,
        user: currentUser,
        timestamp: sessionStartTime.toISOString(),
        quiz: {
          category: pathArray[0] || '',
          subcategory: pathArray[1] || '',
          name: quiz.Thema,
          path: pathArray
        },
        questions: sessionQuestions,
        score: {
          correct: correctCount,
          total: total,
          percentage: total > 0 ? Math.round((correctCount / total) * 100) : 0
        },
        mode: mode,
        duration: duration
      };

      console.log('Saving quiz session:', { sessionId, user: currentUser, quizName: quiz.Thema });
      addSession(session);
      setSessionSaved(true); // Prevent saving the session multiple times
    }
  }, [showResults, sessionSaved, userAnswers.length, shuffledQuestions.length, sessionId, sessionStartTime, params.path, currentUser, quiz, addSession, mode]);

  const calculateCorrectCount = () => {
    return userAnswers.filter(answer => answer.isCorrect).length;
  };


  // Show loading while checking authentication
  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Weiterleitung zur Anmeldung...</p>
        </div>
      </div>
    );
  }

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
          {quiz.PoolConfig && (
            <p className="text-sm text-blue-600 dark:text-blue-400 mt-1 font-medium">
              🎲 Pool-Modus: {shuffledQuestions.length} von {quiz.PoolConfig.poolSize} Fragen (jedes Spiel anders!)
            </p>
          )}
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

export default function QuizPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Quiz wird geladen...</p>
        </div>
      </div>
    }>
      <QuizContent />
    </Suspense>
  );
}
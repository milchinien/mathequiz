'use client';

import { Quiz, UserAnswer } from '@/types/quiz';
import Link from 'next/link';

interface QuizResultsProps {
  quiz: Quiz;
  userAnswers: UserAnswer[];
  correctCount: number;
  totalQuestions: number;
}

export default function QuizResults({
  quiz,
  userAnswers,
  correctCount,
  totalQuestions
}: QuizResultsProps) {
  const percentage = Math.round((correctCount / totalQuestions) * 100);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-6">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-900 dark:text-gray-100">Quiz-Ergebnisse</h1>
        <h2 className="text-xl text-center text-gray-600 dark:text-gray-400 mb-8">{quiz.Thema}</h2>

        <div className="flex justify-center mb-8">
          <div className="text-center">
            <div className={`text-6xl font-bold mb-2 ${
              percentage >= 70 ? 'text-green-600 dark:text-green-400' : percentage >= 50 ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400'
            }`}>
              {percentage}%
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              {correctCount} von {totalQuestions} Fragen richtig
            </p>
          </div>
        </div>

        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 mb-8">
          <div
            className={`h-4 rounded-full transition-all duration-500 ${
              percentage >= 70 ? 'bg-green-500' : percentage >= 50 ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>

        <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Detaillierte Auswertung:</h3>

        <div className="space-y-4">
          {quiz.Fragen.map((question, qIndex) => {
            const userAnswer = userAnswers.find(ua => ua.questionIndex === qIndex);
            const isCorrect = userAnswer?.isCorrect || false;

            return (
              <div
                key={qIndex}
                className={`p-4 rounded-lg border-2 ${
                  isCorrect ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700' : 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700'
                }`}
              >
                <div className="flex items-start mb-2">
                  <span className={`mr-2 text-2xl ${isCorrect ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {isCorrect ? '✓' : '✗'}
                  </span>
                  <div className="flex-1">
                    <p className="font-semibold mb-2 text-gray-900 dark:text-gray-100">
                      Frage {qIndex + 1}: {question.Frage}
                    </p>

                    <div className="ml-4 space-y-1">
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        <span className="font-medium">Deine Antwort(en):</span>
                      </p>
                      {userAnswer?.selectedAnswers.map(aIndex => (
                        <div key={aIndex} className="ml-4 text-sm text-gray-700 dark:text-gray-300">
                          • {question.Antworten[aIndex].Antwort}
                          {isCorrect && question.Antworten[aIndex].Richtig && (
                            <span className="text-green-600 dark:text-green-400 ml-2">
                              ({question.Antworten[aIndex].Kommentar})
                            </span>
                          )}
                          {!isCorrect && !question.Antworten[aIndex].Richtig && (
                            <span className="text-red-600 dark:text-red-400 ml-2">
                              ({question.Antworten[aIndex].Kommentar})
                            </span>
                          )}
                        </div>
                      ))}

                      {!isCorrect && (
                        <>
                          <p className="text-sm mt-2">
                            <span className="font-medium text-green-700 dark:text-green-400">Richtige Antwort(en):</span>
                          </p>
                          {question.Antworten.filter(a => a.Richtig).map((answer, aIndex) => (
                            <div key={aIndex} className="ml-4 text-sm text-green-700 dark:text-green-400">
                              • {answer.Antwort}
                            </div>
                          ))}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-center mt-8 space-x-4">
          <Link
            href="/"
            className="px-6 py-3 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
          >
            Neues Quiz starten
          </Link>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-gray-600 dark:bg-gray-700 text-white rounded-lg hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
          >
            Quiz wiederholen
          </button>
        </div>
      </div>
    </div>
  );
}
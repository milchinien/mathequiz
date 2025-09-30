'use client';

import { Quiz } from '@/types/quiz';

interface QuizPreviewProps {
  quiz: Quiz;
  onSave: () => void;
  onEdit: () => void;
}

export default function QuizPreview({ quiz, onSave, onEdit }: QuizPreviewProps) {
  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-900 dark:text-gray-100">Quiz-Vorschau</h2>
        <h3 className="text-xl font-semibold text-center text-gray-700 dark:text-gray-300 mb-6">{quiz.Thema}</h3>

        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <h4 className="font-semibold text-blue-800 dark:text-blue-400 mb-2">Übersicht:</h4>
          <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
            <li>• Anzahl Fragen: {quiz.Fragen.length}</li>
            <li>• Fragetypen: {
              quiz.Fragen.some(f => f.Typ === 'MultipleAnswer') && quiz.Fragen.some(f => f.Typ === 'SingleAnswer')
                ? 'Gemischt (Single & Multiple Choice)'
                : quiz.Fragen.every(f => f.Typ === 'MultipleAnswer')
                ? 'Multiple Choice'
                : 'Single Choice'
            }</li>
            <li>• Durchschnittliche Antworten pro Frage: {
              Math.round(quiz.Fragen.reduce((acc, f) => acc + f.Antworten.length, 0) / quiz.Fragen.length)
            }</li>
          </ul>
        </div>
      </div>

      <div className="space-y-4">
        {quiz.Fragen.map((frage, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-start gap-4">
              <div className="bg-blue-500 dark:bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                {index + 1}
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-lg mb-2 text-gray-900 dark:text-gray-100">{frage.Frage}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Typ: {frage.Typ === 'SingleAnswer' ? 'Single Choice' : 'Multiple Choice'}
                </p>

                <div className="space-y-2">
                  {frage.Antworten.map((antwort, aIndex) => (
                    <div
                      key={aIndex}
                      className={`p-3 rounded-lg border ${
                        antwort.Richtig
                          ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                          : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600'
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <span className={`font-bold ${antwort.Richtig ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
                          {String.fromCharCode(65 + aIndex)}:
                        </span>
                        <div className="flex-1">
                          <p className={antwort.Richtig ? 'text-green-800 dark:text-green-300 font-medium' : 'text-gray-700 dark:text-gray-300'}>
                            {antwort.Antwort}
                            {antwort.Richtig && (
                              <span className="ml-2 text-green-600 dark:text-green-400 text-sm">✓ Richtig</span>
                            )}
                          </p>
                          {antwort.Kommentar && (
                            <p className={`text-sm mt-1 ${antwort.Richtig ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'}`}>
                              {antwort.Kommentar}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h4 className="font-semibold mb-4 text-gray-900 dark:text-gray-100">Quiz bereit zum Speichern</h4>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Überprüfen Sie das Quiz sorgfältig. Nach dem Speichern ist es sofort für alle Nutzer verfügbar.
        </p>

        <div className="flex gap-4 justify-center">
          <button
            onClick={onEdit}
            className="px-6 py-3 bg-gray-600 dark:bg-gray-700 text-white rounded-lg hover:bg-gray-700 dark:hover:bg-gray-600 transition"
          >
            Bearbeiten
          </button>
          <button
            onClick={onSave}
            className="px-6 py-3 bg-green-600 dark:bg-green-700 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition"
          >
            Quiz speichern
          </button>
        </div>
      </div>
    </div>
  );
}
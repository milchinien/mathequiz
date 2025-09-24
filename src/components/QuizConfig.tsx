'use client';

import { QuizGenerationConfig } from '@/app/generate/page';

interface QuizConfigProps {
  config: QuizGenerationConfig;
  onConfigChange: (config: QuizGenerationConfig) => void;
}

export default function QuizConfig({ config, onConfigChange }: QuizConfigProps) {
  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="quiz-title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Quiz-Titel <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="quiz-title"
          value={config.quizTitle}
          onChange={(e) => onConfigChange({ ...config, quizTitle: e.target.value })}
          placeholder="z.B. Binomische Formeln Grundlagen"
          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
        />
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Dieser Titel wird als Dateiname verwendet
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="question-count" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Anzahl der Fragen
          </label>
          <input
            type="number"
            id="question-count"
            value={config.questionCount}
            onChange={(e) => onConfigChange({ ...config, questionCount: parseInt(e.target.value) || 10 })}
            min="1"
            max="50"
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
        </div>

        <div>
          <label htmlFor="answers-per-question" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Antworten pro Frage
          </label>
          <input
            type="number"
            id="answers-per-question"
            value={config.answersPerQuestion}
            onChange={(e) => onConfigChange({ ...config, answersPerQuestion: parseInt(e.target.value) || 4 })}
            min="2"
            max="8"
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Antworttyp
        </label>
        <div className="flex gap-4">
          <label className="flex items-center">
            <input
              type="radio"
              value="single"
              checked={!config.allowMultipleAnswers}
              onChange={() => onConfigChange({ ...config, allowMultipleAnswers: false })}
              className="mr-2"
            />
            <span className="text-gray-700 dark:text-gray-300">Nur Einzelauswahl (Single Choice)</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              value="multiple"
              checked={config.allowMultipleAnswers}
              onChange={() => onConfigChange({ ...config, allowMultipleAnswers: true })}
              className="mr-2"
            />
            <span className="text-gray-700 dark:text-gray-300">Mehrfachauswahl möglich (Multiple Choice)</span>
          </label>
        </div>
      </div>

      <div>
        <label htmlFor="target-audience" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Zielgruppe
        </label>
        <input
          type="text"
          id="target-audience"
          value={config.targetAudience}
          onChange={(e) => onConfigChange({ ...config, targetAudience: e.target.value })}
          placeholder="z.B. Schüler der 9. Klasse, Matheprofessoren, Grundschüler..."
          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
        />
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Die Schwierigkeit und Sprache des Quiz wird an diese Zielgruppe angepasst
        </p>
      </div>
    </div>
  );
}
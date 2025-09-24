'use client';

import { useState } from 'react';
import Link from 'next/link';
import CategorySelector from '@/components/CategorySelector';
import ContentInput from '@/components/ContentInput';
import QuizConfig from '@/components/QuizConfig';
import QuizPreview from '@/components/QuizPreview';
import { Quiz } from '@/types/quiz';

export interface QuizGenerationConfig {
  category: string;
  subcategory: string;
  questionCount: number;
  answersPerQuestion: number;
  allowMultipleAnswers: boolean;
  targetAudience: string;
  quizTitle: string;
}

export default function GeneratePage() {
  const [content, setContent] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [config, setConfig] = useState<QuizGenerationConfig>({
    category: '',
    subcategory: '',
    questionCount: 10,
    answersPerQuestion: 4,
    allowMultipleAnswers: false,
    targetAudience: 'Schüler der 9. Klasse',
    quizTitle: ''
  });
  const [generatedQuiz, setGeneratedQuiz] = useState<Quiz | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedFileName, setSavedFileName] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!config.category || !config.subcategory) {
      setError('Bitte wählen Sie eine Kategorie und Unterkategorie aus');
      return;
    }

    if (!content && !file) {
      setError('Bitte geben Sie Inhalt ein oder laden Sie eine Datei hoch');
      return;
    }

    if (!config.quizTitle) {
      setError('Bitte geben Sie einen Titel für das Quiz ein');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const formData = new FormData();

      if (file) {
        formData.append('file', file);
      } else {
        formData.append('content', content);
      }

      formData.append('config', JSON.stringify(config));

      const response = await fetch('/api/generate-quiz', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Quiz-Generierung fehlgeschlagen');
      }

      const quiz = await response.json();
      setGeneratedQuiz(quiz);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ein unerwarteter Fehler ist aufgetreten');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!generatedQuiz || !config.category || !config.subcategory || !config.quizTitle) {
      return;
    }

    try {
      const response = await fetch('/api/save-quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          quiz: generatedQuiz,
          category: config.category,
          subcategory: config.subcategory,
          filename: config.quizTitle
        })
      });

      if (!response.ok) {
        throw new Error('Speichern fehlgeschlagen');
      }

      const { filename } = await response.json();
      setSavedFileName(filename);
    } catch (err) {
      setError('Quiz konnte nicht gespeichert werden');
    }
  };

  const handleReset = () => {
    setGeneratedQuiz(null);
    setSavedFileName(null);
    setContent('');
    setFile(null);
    setConfig({
      ...config,
      quizTitle: ''
    });
  };

  if (savedFileName) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <h2 className="text-2xl font-bold text-green-600 mb-4">Quiz erfolgreich gespeichert!</h2>
            <p className="text-gray-700 mb-6">
              Das Quiz "{config.quizTitle}" wurde in der Kategorie {config.category}/{config.subcategory} gespeichert.
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                href={`/quiz/${config.category}/${config.subcategory}/${savedFileName}?mode=immediate`}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Quiz spielen
              </Link>
              <button
                onClick={handleReset}
                className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
              >
                Neues Quiz erstellen
              </button>
              <Link
                href="/"
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              >
                Zur Übersicht
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (generatedQuiz) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="mb-6">
            <button
              onClick={handleReset}
              className="text-blue-600 hover:underline flex items-center gap-2"
            >
              ← Zurück zur Generierung
            </button>
          </div>
          <QuizPreview
            quiz={generatedQuiz}
            onSave={handleSave}
            onEdit={handleReset}
          />
        </div>
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

        <h1 className="text-3xl font-bold mb-8 text-center">Neues Quiz generieren</h1>

        <div className="space-y-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">1. Kategorie auswählen</h2>
            <CategorySelector
              category={config.category}
              subcategory={config.subcategory}
              onCategoryChange={(cat) => setConfig({ ...config, category: cat })}
              onSubcategoryChange={(subcat) => setConfig({ ...config, subcategory: subcat })}
            />
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">2. Inhalt bereitstellen</h2>
            <ContentInput
              content={content}
              onContentChange={setContent}
              onFileChange={setFile}
            />
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">3. Quiz konfigurieren</h2>
            <QuizConfig
              config={config}
              onConfigChange={setConfig}
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div className="flex justify-center">
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className={`px-8 py-4 text-lg font-semibold rounded-lg transition ${
                isGenerating
                  ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              {isGenerating ? 'Quiz wird generiert...' : 'Quiz generieren'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
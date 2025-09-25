'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';
import CreationTypeSelector, { CreationTypeSelection } from '@/components/CreationTypeSelector';
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
  const { isAuthenticated, isLoading } = useProtectedRoute();
  const [creationType, setCreationType] = useState<CreationTypeSelection | null>(null);
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

  const handleGenerate = async () => {
    if (creationType?.type !== 'quiz') {
      setError('Quiz-Generierung ist nur im "Quiz erstellen" Modus verfügbar');
      return;
    }

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
    setCreationType(null);
    setConfig({
      category: '',
      subcategory: '',
      questionCount: 10,
      answersPerQuestion: 4,
      allowMultipleAnswers: false,
      targetAudience: 'Schüler der 9. Klasse',
      quizTitle: ''
    });
  };

  if (savedFileName) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
            <h2 className="text-2xl font-bold text-green-600 dark:text-green-400 mb-4">Quiz erfolgreich gespeichert!</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Das Quiz &quot;{config.quizTitle}&quot; wurde in der Kategorie {config.category}/{config.subcategory} gespeichert.
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                href={`/quiz/${config.category}/${config.subcategory}/${savedFileName}?mode=immediate`}
                className="px-6 py-3 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition"
              >
                Quiz spielen
              </Link>
              <button
                onClick={handleReset}
                className="px-6 py-3 bg-gray-600 dark:bg-gray-700 text-white rounded-lg hover:bg-gray-700 dark:hover:bg-gray-600 transition"
              >
                Neues Quiz erstellen
              </button>
              <Link
                href="/"
                className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
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
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="mb-6">
            <button
              onClick={handleReset}
              className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-2"
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
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-6">
          <Link href="/" className="text-blue-600 dark:text-blue-400 hover:underline">
            ← Zurück zur Übersicht
          </Link>
        </div>

        <h1 className="text-3xl font-bold mb-8 text-center text-gray-900 dark:text-gray-100">
          {creationType === null ? 'Was möchten Sie erstellen?' :
           creationType.type === 'category' ? 'Neue Kategorie erstellen' :
           creationType.type === 'subcategory' ? 'Neue Unterkategorie erstellen' :
           'Neues Quiz generieren'}
        </h1>

        <div className="space-y-8">
          {!creationType ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-6 text-center text-gray-900 dark:text-gray-100">Wählen Sie den Erstellungstyp</h2>
              <CreationTypeSelector onSelectionChange={setCreationType} />
            </div>
          ) : creationType.type === 'category' ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Neue Kategorie erstellen</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Erstellen Sie eine neue Hauptkategorie für Ihre Quizze.
              </p>
              <div className="max-w-md">
                <input
                  type="text"
                  placeholder="Name der neuen Kategorie..."
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                />
                <div className="flex gap-3 mt-4">
                  <button className="px-6 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition">
                    Kategorie erstellen
                  </button>
                  <button
                    onClick={() => setCreationType(null)}
                    className="px-6 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition"
                  >
                    Zurück
                  </button>
                </div>
              </div>
            </div>
          ) : creationType.type === 'subcategory' ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Neue Unterkategorie erstellen</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Wählen Sie erst eine Kategorie aus und erstellen Sie dann eine neue Unterkategorie.
              </p>
              <div className="space-y-4 max-w-md">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Kategorie auswählen
                  </label>
                  <select className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                    <option value="">Kategorie wählen...</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Name der neuen Unterkategorie
                  </label>
                  <input
                    type="text"
                    placeholder="Name der neuen Unterkategorie..."
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                  />
                </div>
                <div className="flex gap-3">
                  <button className="px-6 py-2 bg-green-600 dark:bg-green-700 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition">
                    Unterkategorie erstellen
                  </button>
                  <button
                    onClick={() => setCreationType(null)}
                    className="px-6 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition"
                  >
                    Zurück
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">1. Kategorie auswählen</h2>
                <CategorySelector
                  category={config.category}
                  subcategory={config.subcategory}
                  onCategoryChange={(cat) => {
                    setConfig(prevConfig => ({ ...prevConfig, category: cat }));
                  }}
                  onSubcategoryChange={(subcat) => {
                    setConfig(prevConfig => ({ ...prevConfig, subcategory: subcat }));
                  }}
                />
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">2. Inhalt bereitstellen</h2>
                <ContentInput
                  content={content}
                  onContentChange={setContent}
                  onFileChange={setFile}
                />
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">3. Quiz konfigurieren</h2>
                <QuizConfig
                  config={config}
                  onConfigChange={setConfig}
                />
              </div>

              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded">
                  {error}
                </div>
              )}

              <div className="flex justify-center gap-4">
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className={`px-8 py-4 text-lg font-semibold rounded-lg transition ${
                    isGenerating
                      ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                      : 'bg-green-600 dark:bg-green-700 text-white hover:bg-green-700 dark:hover:bg-green-600'
                  }`}
                >
                  {isGenerating ? 'Quiz wird generiert...' : 'Quiz generieren'}
                </button>
                <button
                  onClick={() => setCreationType(null)}
                  className="px-6 py-4 text-lg font-semibold bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition"
                >
                  Zurück zur Auswahl
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
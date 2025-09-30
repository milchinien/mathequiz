'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';
import { Quiz, QuizStructure } from '@/types/quiz';
import Link from 'next/link';

export default function EditPage() {
  const { isAuthenticated, isLoading } = useProtectedRoute();
  const searchParams = useSearchParams();
  const [structure, setStructure] = useState<QuizStructure>({});
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('');
  const [selectedQuiz, setSelectedQuiz] = useState<string>('');
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null);
  const [isLoadingQuiz, setIsLoadingQuiz] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  // Initialize from URL parameters if available
  useEffect(() => {
    const category = searchParams.get('category');
    const subcategory = searchParams.get('subcategory');
    const quiz = searchParams.get('quiz');

    if (category) setSelectedCategory(category);
    if (subcategory) setSelectedSubcategory(subcategory);
    if (quiz) setSelectedQuiz(quiz);
  }, [searchParams]);

  useEffect(() => {
    fetchQuizStructure();
  }, []);

  useEffect(() => {
    if (selectedCategory && selectedSubcategory && selectedQuiz) {
      loadQuiz();
    } else {
      setCurrentQuiz(null);
    }
  }, [selectedCategory, selectedSubcategory, selectedQuiz]);

  const fetchQuizStructure = async () => {
    try {
      const response = await fetch('/api/quizzes');
      const data = await response.json();
      setStructure(data);
    } catch (error) {
      console.error('Error fetching quiz structure:', error);
    }
  };

  const loadQuiz = async () => {
    if (!selectedCategory || !selectedSubcategory || !selectedQuiz) return;

    setIsLoadingQuiz(true);
    try {
      const response = await fetch(`/api/quiz/${selectedCategory}/${selectedSubcategory}/${selectedQuiz}`);
      if (response.ok) {
        const quiz = await response.json();
        setCurrentQuiz(quiz);
      } else {
        console.error('Failed to load quiz');
      }
    } catch (error) {
      console.error('Error loading quiz:', error);
    } finally {
      setIsLoadingQuiz(false);
    }
  };

  const saveQuiz = async () => {
    if (!currentQuiz) return;

    setIsSaving(true);
    setSaveMessage(null);

    try {
      const response = await fetch('/api/quiz-management', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: selectedCategory,
          subcategory: selectedSubcategory,
          filename: selectedQuiz,
          quiz: currentQuiz
        })
      });

      if (response.ok) {
        setSaveMessage('Quiz erfolgreich gespeichert!');
        setTimeout(() => setSaveMessage(null), 3000);
      } else {
        setSaveMessage('Fehler beim Speichern des Quiz.');
      }
    } catch (error) {
      console.error('Error saving quiz:', error);
      setSaveMessage('Fehler beim Speichern des Quiz.');
    } finally {
      setIsSaving(false);
    }
  };

  const updateQuizTitle = (title: string) => {
    if (currentQuiz) {
      setCurrentQuiz({ ...currentQuiz, Thema: title });
    }
  };

  const updateQuestion = (questionIndex: number, field: 'Frage' | 'explanation', value: string) => {
    if (currentQuiz) {
      const updatedQuestions = [...currentQuiz.Fragen];
      updatedQuestions[questionIndex] = {
        ...updatedQuestions[questionIndex],
        [field]: value
      };
      setCurrentQuiz({ ...currentQuiz, Fragen: updatedQuestions });
    }
  };

  const updateAnswer = (questionIndex: number, answerIndex: number, field: 'Antwort' | 'Richtig', value: string | boolean) => {
    if (currentQuiz) {
      const updatedQuestions = [...currentQuiz.Fragen];
      const updatedAnswers = [...updatedQuestions[questionIndex].Antworten];
      updatedAnswers[answerIndex] = {
        ...updatedAnswers[answerIndex],
        [field]: value
      };
      updatedQuestions[questionIndex] = {
        ...updatedQuestions[questionIndex],
        Antworten: updatedAnswers
      };
      setCurrentQuiz({ ...currentQuiz, Fragen: updatedQuestions });
    }
  };

  const addQuestion = () => {
    if (currentQuiz) {
      const newQuestion = {
        Frage: 'Neue Frage',
        Typ: 'MultipleAnswer' as const,
        Antworten: [
          { Antwort: 'Antwort 1', Richtig: true, Kommentar: '' },
          { Antwort: 'Antwort 2', Richtig: false, Kommentar: '' },
          { Antwort: 'Antwort 3', Richtig: false, Kommentar: '' },
          { Antwort: 'Antwort 4', Richtig: false, Kommentar: '' }
        ]
      };
      setCurrentQuiz({
        ...currentQuiz,
        Fragen: [...currentQuiz.Fragen, newQuestion]
      });
    }
  };

  const removeQuestion = (questionIndex: number) => {
    if (currentQuiz && currentQuiz.Fragen.length > 1) {
      const updatedQuestions = currentQuiz.Fragen.filter((_, index) => index !== questionIndex);
      setCurrentQuiz({ ...currentQuiz, Fragen: updatedQuestions });
    }
  };

  const addAnswer = (questionIndex: number) => {
    if (currentQuiz) {
      const updatedQuestions = [...currentQuiz.Fragen];
      updatedQuestions[questionIndex].Antworten.push({
        Antwort: 'Neue Antwort',
        Richtig: false,
        Kommentar: ''
      });
      setCurrentQuiz({ ...currentQuiz, Fragen: updatedQuestions });
    }
  };

  const removeAnswer = (questionIndex: number, answerIndex: number) => {
    if (currentQuiz) {
      const question = currentQuiz.Fragen[questionIndex];
      if (question.Antworten.length > 2) {
        const updatedQuestions = [...currentQuiz.Fragen];
        updatedQuestions[questionIndex].Antworten = question.Antworten.filter((_, index) => index !== answerIndex);
        setCurrentQuiz({ ...currentQuiz, Fragen: updatedQuestions });
      }
    }
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-6">
          <Link href="/" className="text-blue-600 dark:text-blue-400 hover:underline">
            ← Zurück zur Übersicht
          </Link>
        </div>

        <h1 className="text-3xl font-bold mb-8 text-center text-gray-900 dark:text-gray-100">
          Quiz bearbeiten
        </h1>

        {/* Quiz Selection */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Quiz auswählen</h2>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Category Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Kategorie
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setSelectedSubcategory('');
                  setSelectedQuiz('');
                }}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="">Kategorie wählen...</option>
                {Object.keys(structure).map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Subcategory Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Unterkategorie
              </label>
              <select
                value={selectedSubcategory}
                onChange={(e) => {
                  setSelectedSubcategory(e.target.value);
                  setSelectedQuiz('');
                }}
                disabled={!selectedCategory}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 disabled:bg-gray-100 dark:disabled:bg-gray-600 disabled:cursor-not-allowed"
              >
                <option value="">Unterkategorie wählen...</option>
                {selectedCategory && structure[selectedCategory] && Object.keys(structure[selectedCategory]).map(subcat => (
                  <option key={subcat} value={subcat}>{subcat}</option>
                ))}
              </select>
            </div>

            {/* Quiz Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Quiz
              </label>
              <select
                value={selectedQuiz}
                onChange={(e) => setSelectedQuiz(e.target.value)}
                disabled={!selectedSubcategory}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 disabled:bg-gray-100 dark:disabled:bg-gray-600 disabled:cursor-not-allowed"
              >
                <option value="">Quiz wählen...</option>
                {selectedCategory && selectedSubcategory && structure[selectedCategory] && structure[selectedCategory][selectedSubcategory] &&
                  structure[selectedCategory][selectedSubcategory].map(quiz => (
                    <option key={quiz} value={quiz}>{quiz.replace('.json', '')}</option>
                  ))
                }
              </select>
            </div>
          </div>
        </div>

        {/* Quiz Editor */}
        {currentQuiz && (
          <div className="space-y-6">
            {/* Quiz Title */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Quiz-Titel</h2>
              <input
                type="text"
                value={currentQuiz.Thema}
                onChange={(e) => updateQuizTitle(e.target.value)}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>

            {/* Questions */}
            <div className="space-y-6">
              {currentQuiz.Fragen.map((question, questionIndex) => (
                <div key={questionIndex} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      Frage {questionIndex + 1}
                    </h3>
                    {currentQuiz.Fragen.length > 1 && (
                      <button
                        onClick={() => removeQuestion(questionIndex)}
                        className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                      >
                        Frage löschen
                      </button>
                    )}
                  </div>

                  <div className="space-y-4">
                    {/* Question Text */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Fragetext
                      </label>
                      <textarea
                        value={question.Frage}
                        onChange={(e) => updateQuestion(questionIndex, 'Frage', e.target.value)}
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 resize-none"
                        rows={2}
                      />
                    </div>

                    {/* Answers */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Antworten
                        </label>
                        <button
                          onClick={() => addAnswer(questionIndex)}
                          className="px-3 py-1 bg-blue-600 dark:bg-blue-700 text-white rounded hover:bg-blue-700 dark:hover:bg-blue-600 text-sm"
                        >
                          Antwort hinzufügen
                        </button>
                      </div>
                      <div className="space-y-2">
                        {question.Antworten.map((answer, answerIndex) => (
                          <div key={answerIndex} className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              checked={answer.Richtig}
                              onChange={(e) => updateAnswer(questionIndex, answerIndex, 'Richtig', e.target.checked)}
                              className="w-5 h-5 text-green-600 rounded"
                            />
                            <input
                              type="text"
                              value={answer.Antwort}
                              onChange={(e) => updateAnswer(questionIndex, answerIndex, 'Antwort', e.target.value)}
                              className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                            />
                            {question.Antworten.length > 2 && (
                              <button
                                onClick={() => removeAnswer(questionIndex, answerIndex)}
                                className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                              >
                                ×
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Question Button */}
            <div className="text-center">
              <button
                onClick={addQuestion}
                className="px-6 py-3 bg-green-600 dark:bg-green-700 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-600"
              >
                Neue Frage hinzufügen
              </button>
            </div>

            {/* Save Button */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center">
                <div>
                  {saveMessage && (
                    <p className={`text-sm ${saveMessage.includes('erfolgreich') ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                      {saveMessage}
                    </p>
                  )}
                </div>
                <button
                  onClick={saveQuiz}
                  disabled={isSaving}
                  className={`px-6 py-3 rounded-lg font-medium transition ${
                    isSaving
                      ? 'bg-gray-400 dark:bg-gray-600 text-gray-200 dark:text-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 dark:bg-blue-700 text-white hover:bg-blue-700 dark:hover:bg-blue-600'
                  }`}
                >
                  {isSaving ? 'Wird gespeichert...' : 'Quiz speichern'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Loading Quiz */}
        {isLoadingQuiz && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Quiz wird geladen...</p>
          </div>
        )}

        {/* No Quiz Selected */}
        {!currentQuiz && !isLoadingQuiz && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              Wählen Sie ein Quiz aus, um es zu bearbeiten.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
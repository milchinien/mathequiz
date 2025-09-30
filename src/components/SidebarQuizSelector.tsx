'use client';

import { useState, useEffect } from 'react';
import { QuizStructure } from '@/types/quiz';
import Link from 'next/link';
import ModeToggle from '@/components/ModeToggle';

export default function SidebarQuizSelector() {
  const [structure, setStructure] = useState<QuizStructure>({});
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [expandedSubcategories, setExpandedSubcategories] = useState<Set<string>>(new Set());
  const [selectedQuiz, setSelectedQuiz] = useState<{ category: string; subcategory: string; quiz: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<'immediate' | 'summary'>('immediate');

  useEffect(() => {
    fetchQuizStructure();
  }, []);

  const fetchQuizStructure = async () => {
    try {
      const response = await fetch('/api/quizzes');
      const data = await response.json();
      setStructure(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching quiz structure:', error);
      setLoading(false);
    }
  };

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(category)) {
        newSet.delete(category);
        // Also collapse all subcategories in this category
        Object.keys(structure[category] || {}).forEach(subcat => {
          const key = `${category}/${subcat}`;
          newSet.delete(key);
        });
      } else {
        newSet.add(category);
      }
      return newSet;
    });
  };

  const toggleSubcategory = (category: string, subcategory: string) => {
    const key = `${category}/${subcategory}`;
    setExpandedSubcategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(key)) {
        newSet.delete(key);
      } else {
        newSet.add(key);
      }
      return newSet;
    });
  };

  const handleQuizSelect = (category: string, subcategory: string, quiz: string) => {
    setSelectedQuiz({ category, subcategory, quiz });
  };

  const handleDeleteQuiz = async () => {
    if (!selectedQuiz) return;

    if (!confirm(`Möchtest du das Quiz "${selectedQuiz.quiz.replace('.json', '')}" wirklich löschen?`)) {
      return;
    }

    try {
      const response = await fetch('/api/quiz-management', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: selectedQuiz.category,
          subcategory: selectedQuiz.subcategory,
          quiz: selectedQuiz.quiz,
        }),
      });

      if (response.ok) {
        // Refresh the structure and clear selection
        await fetchQuizStructure();
        setSelectedQuiz(null);
      } else {
        alert('Fehler beim Löschen des Quiz');
      }
    } catch (error) {
      console.error('Error deleting quiz:', error);
      alert('Fehler beim Löschen des Quiz');
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen">
        <div className="flex justify-center items-center flex-1">
          <div className="text-xl">Lade Quizze...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
      {/* Left Sidebar */}
      <div className="w-96 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-2">
            <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Quiz-Auswahl</h1>
          </div>
          <p className="text-base text-gray-600 dark:text-gray-400">Wähle ein Quiz zum Lernen</p>
        </div>

        {/* Scrollable Categories List */}
        <div className="flex-1 overflow-y-auto p-4">
          {Object.keys(structure).map(category => (
            <div key={category} className="mb-2">
              {/* Category Button */}
              <button
                onClick={() => toggleCategory(category)}
                className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left group"
              >
                <div className="flex items-center gap-3 flex-1">
                  <svg className="w-6 h-6 text-blue-500 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                  </svg>
                  <span className="font-medium text-gray-900 dark:text-gray-100 text-base">{category}</span>
                </div>
                <svg
                  className={`w-5 h-5 text-gray-500 dark:text-gray-400 transition-transform ${
                    expandedCategories.has(category) ? 'rotate-90' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              {/* Subcategories */}
              {expandedCategories.has(category) && (
                <div className="ml-6 mt-2 space-y-2">
                  {Object.keys(structure[category] || {}).map(subcategory => {
                    const subcatKey = `${category}/${subcategory}`;
                    return (
                      <div key={subcategory}>
                        {/* Subcategory Button */}
                        <button
                          onClick={() => toggleSubcategory(category, subcategory)}
                          className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
                        >
                          <div className="flex items-center gap-2 flex-1">
                            <svg className="w-5 h-5 text-green-500 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1H8a3 3 0 00-3 3v1.5a1.5 1.5 0 01-3 0V6z" clipRule="evenodd" />
                              <path d="M6 12a2 2 0 012-2h8a2 2 0 012 2v2a2 2 0 01-2 2H2h2a2 2 0 002-2v-2z" />
                            </svg>
                            <span className="text-base text-gray-700 dark:text-gray-300">{subcategory}</span>
                          </div>
                          <svg
                            className={`w-4 h-4 text-gray-400 dark:text-gray-500 transition-transform ${
                              expandedSubcategories.has(subcatKey) ? 'rotate-90' : ''
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>

                        {/* Quizzes */}
                        {expandedSubcategories.has(subcatKey) && (
                          <div className="ml-7 mt-2 space-y-2">
                            {structure[category][subcategory]?.map(quiz => {
                              const isSelected = selectedQuiz?.category === category &&
                                                selectedQuiz?.subcategory === subcategory &&
                                                selectedQuiz?.quiz === quiz;
                              return (
                                <button
                                  key={quiz}
                                  onClick={() => handleQuizSelect(category, subcategory, quiz)}
                                  className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors text-left ${
                                    isSelected
                                      ? 'bg-purple-100 dark:bg-purple-900 border-l-4 border-purple-500'
                                      : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                                  }`}
                                >
                                  <svg className="w-5 h-5 text-purple-500 dark:text-purple-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                                    <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                                  </svg>
                                  <span className="text-sm text-gray-700 dark:text-gray-300 truncate flex-1">
                                    {quiz.replace('.json', '')}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Right Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-8">
          {selectedQuiz ? (
            <div className="max-w-4xl mx-auto">
              {/* Quiz Header */}
              <div className="mb-8">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
                  <span>{selectedQuiz.category}</span>
                  <span>›</span>
                  <span>{selectedQuiz.subcategory}</span>
                </div>
                <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                  {selectedQuiz.quiz.replace('.json', '')}
                </h1>
              </div>

              {/* Mode Toggle */}
              <div className="mb-6">
                <ModeToggle mode={mode} onModeChange={setMode} />
              </div>

              {/* Quiz Info Card */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Quiz-Informationen</h2>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    <span className="text-gray-700 dark:text-gray-300">
                      Kategorie: <strong>{selectedQuiz.category}</strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                    </svg>
                    <span className="text-gray-700 dark:text-gray-300">
                      Unterkategorie: <strong>{selectedQuiz.subcategory}</strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className="text-gray-700 dark:text-gray-300">
                      Modus: <strong>{mode === 'immediate' ? 'Sofort-Feedback' : 'Zusammenfassung'}</strong>
                    </span>
                  </div>
                </div>
              </div>

              {/* Start Quiz Button */}
              <Link
                href={`/quiz/${selectedQuiz.category}/${selectedQuiz.subcategory}/${selectedQuiz.quiz}?mode=${mode}`}
                className="block w-full max-w-md mx-auto"
              >
                <button className="w-full px-8 py-4 bg-blue-600 dark:bg-blue-700 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors shadow-lg hover:shadow-xl">
                  Quiz starten
                </button>
              </Link>

              {/* Edit/Delete Actions */}
              <div className="mt-6 flex gap-3 justify-center">
                <Link
                  href={`/edit?category=${selectedQuiz.category}&subcategory=${selectedQuiz.subcategory}&quiz=${selectedQuiz.quiz}`}
                  className="px-4 py-2 text-sm bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Quiz bearbeiten
                </Link>
                <button
                  onClick={handleDeleteQuiz}
                  className="px-4 py-2 text-sm bg-red-500 dark:bg-red-600 text-white rounded-lg hover:bg-red-600 dark:hover:bg-red-700 transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Quiz löschen
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <svg className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Kein Quiz ausgewählt
                </h2>
                <p className="text-gray-500 dark:text-gray-400">
                  Wähle ein Quiz aus der Seitenleiste, um zu beginnen
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
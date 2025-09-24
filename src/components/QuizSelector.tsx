'use client';

import { useState, useEffect } from 'react';
import { QuizStructure } from '@/types/quiz';
import Link from 'next/link';
import ModeToggle from '@/components/ModeToggle';

export default function QuizSelector() {
  const [structure, setStructure] = useState<QuizStructure>({});
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('');
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl">Lade Quizze...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-gray-100">Quiz-Auswahl</h1>


      <ModeToggle mode={mode} onModeChange={setMode} />

      <div
        className={`grid gap-6 transition-all duration-300 ${
          !selectedCategory
            ? 'md:grid-cols-[2fr_1fr_1fr]' // Kategorie größer
            : !selectedSubcategory
            ? 'md:grid-cols-[1fr_2fr_1fr]' // Unterkategorie größer
            : 'md:grid-cols-[1fr_1fr_2fr]' // Quiz größer
        } grid-cols-1`}
      >
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Kategorie</h2>
          <div className="space-y-2">
            {Object.keys(structure).map(category => (
              <div
                key={category}
                className={`w-full rounded transition-colors ${
                  selectedCategory === category
                    ? 'bg-blue-100 dark:bg-blue-900 border-l-4 border-blue-500'
                    : ''
                }`}
              >
                <div className="flex items-center">
                  <button
                    onClick={() => {
                      setSelectedCategory(category);
                      setSelectedSubcategory('');
                    }}
                    className={`flex-1 p-2 text-left hover:bg-blue-50 dark:hover:bg-blue-900/50 transition-colors ${
                      selectedCategory === category
                        ? ''
                        : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {category}
                  </button>
                  <div className="flex gap-1 px-2">
                    <button
                      onClick={() => {/* TODO: Edit category */}}
                      className="p-1 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      title="Kategorie bearbeiten"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => {/* TODO: Delete category */}}
                      className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                      title="Kategorie löschen"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Unterkategorie</h2>
          <div className="space-y-2">
            {selectedCategory &&
              Object.keys(structure[selectedCategory] || {}).map(subcategory => (
                <div
                  key={subcategory}
                  className={`w-full rounded transition-colors ${
                    selectedSubcategory === subcategory
                      ? 'bg-green-100 dark:bg-green-900 border-l-4 border-green-500'
                      : ''
                  }`}
                >
                  <div className="flex items-center">
                    <button
                      onClick={() => setSelectedSubcategory(subcategory)}
                      className={`flex-1 p-2 text-left hover:bg-green-50 dark:hover:bg-green-900/50 transition-colors ${
                        selectedSubcategory === subcategory
                          ? ''
                          : 'text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {subcategory}
                    </button>
                    <div className="flex gap-1 px-2">
                      <button
                        onClick={() => {/* TODO: Edit subcategory */}}
                        className="p-1 text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                        title="Unterkategorie bearbeiten"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => {/* TODO: Delete subcategory */}}
                        className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                        title="Unterkategorie löschen"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            {selectedCategory && Object.keys(structure[selectedCategory] || {}).length === 0 && (
              <p className="text-gray-500 dark:text-gray-400 text-sm">Keine Unterkategorien verfügbar</p>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Verfügbare Quizze</h2>
          <div className="space-y-2">
            {selectedCategory &&
              selectedSubcategory &&
              structure[selectedCategory][selectedSubcategory]?.map(quiz => (
                <div
                  key={quiz}
                  className="w-full rounded bg-purple-100 dark:bg-purple-900 border-l-4 border-purple-500 transition-colors"
                >
                  <div className="flex items-center">
                    <Link
                      href={`/quiz/${selectedCategory}/${selectedSubcategory}/${quiz}?mode=${mode}`}
                      className="flex-1 p-2 text-left hover:bg-purple-50 dark:hover:bg-purple-900/50 transition-colors text-gray-900 dark:text-gray-100"
                    >
                      {quiz.replace('.json', '')}
                    </Link>
                    <div className="flex gap-1 px-2">
                      <button
                        onClick={() => {/* TODO: Edit quiz */}}
                        className="p-1 text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                        title="Quiz bearbeiten"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => {/* TODO: Delete quiz */}}
                        className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                        title="Quiz löschen"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            {selectedCategory && selectedSubcategory &&
              (!structure[selectedCategory][selectedSubcategory] ||
                structure[selectedCategory][selectedSubcategory].length === 0) && (
                <p className="text-gray-500 dark:text-gray-400 text-sm">Keine Quizze verfügbar</p>
              )}
          </div>
        </div>
      </div>
    </div>
  );
}
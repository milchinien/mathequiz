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

      <div className="mb-6 text-center">
        <Link
          href="/generate"
          className="inline-block px-6 py-3 bg-green-600 dark:bg-green-700 text-white font-semibold rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition"
        >
          🎯 Neues Quiz generieren
        </Link>
      </div>

      <ModeToggle mode={mode} onModeChange={setMode} />

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Kategorie</h2>
          <div className="space-y-2">
            {Object.keys(structure).map(category => (
              <button
                key={category}
                onClick={() => {
                  setSelectedCategory(category);
                  setSelectedSubcategory('');
                }}
                className={`w-full p-2 text-left rounded hover:bg-blue-50 dark:hover:bg-blue-900/50 transition-colors ${
                  selectedCategory === category
                    ? 'bg-blue-100 dark:bg-blue-900 border-l-4 border-blue-500'
                    : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Unterkategorie</h2>
          <div className="space-y-2">
            {selectedCategory &&
              Object.keys(structure[selectedCategory] || {}).map(subcategory => (
                <button
                  key={subcategory}
                  onClick={() => setSelectedSubcategory(subcategory)}
                  className={`w-full p-2 text-left rounded hover:bg-green-50 dark:hover:bg-green-900/50 transition-colors ${
                    selectedSubcategory === subcategory
                      ? 'bg-green-100 dark:bg-green-900 border-l-4 border-green-500'
                      : 'text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {subcategory}
                </button>
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
                <Link
                  key={quiz}
                  href={`/quiz/${selectedCategory}/${selectedSubcategory}/${quiz}?mode=${mode}`}
                  className="block w-full p-2 text-left rounded hover:bg-purple-50 dark:hover:bg-purple-900/50 bg-purple-100 dark:bg-purple-900 border-l-4 border-purple-500 transition-colors text-gray-900 dark:text-gray-100"
                >
                  {quiz.replace('.json', '')}
                </Link>
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
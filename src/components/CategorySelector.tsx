'use client';

import { useState, useEffect } from 'react';
import { QuizStructure } from '@/types/quiz';

interface CategorySelectorProps {
  category: string;
  subcategory: string;
  onCategoryChange: (category: string) => void;
  onSubcategoryChange: (subcategory: string) => void;
}

export default function CategorySelector({
  category,
  subcategory,
  onCategoryChange,
  onSubcategoryChange
}: CategorySelectorProps) {
  const [structure, setStructure] = useState<QuizStructure>({});
  const [newCategory, setNewCategory] = useState('');
  const [newSubcategory, setNewSubcategory] = useState('');
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [showNewSubcategory, setShowNewSubcategory] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuizStructure();
  }, []);

  useEffect(() => {
    // Structure loaded, component ready
  }, [structure]);

  const fetchQuizStructure = async () => {
    try {
      const response = await fetch('/api/quizzes');
      const data = await response.json();
      // Quiz structure loaded successfully
      setStructure(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching quiz structure:', error);
      setLoading(false);
    }
  };

  const handleCreateCategory = async () => {
    if (!newCategory.trim()) return;

    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category: newCategory.trim() })
      });

      if (response.ok) {
        setLoading(true);
        await fetchQuizStructure();
        onCategoryChange(newCategory.trim());
        setNewCategory('');
        setShowNewCategory(false);
      }
    } catch (error) {
      console.error('Error creating category:', error);
      setLoading(false);
    }
  };

  const handleCreateSubcategory = async () => {
    if (!newSubcategory.trim() || !category) return;

    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: category,
          subcategory: newSubcategory.trim()
        })
      });

      if (response.ok) {
        setLoading(true);
        await fetchQuizStructure();
        onSubcategoryChange(newSubcategory.trim());
        setNewSubcategory('');
        setShowNewSubcategory(false);
      }
    } catch (error) {
      console.error('Error creating subcategory:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Kategorie
          </label>
          <div className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-500 dark:text-gray-400">
            Lade Kategorien...
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Unterkategorie
          </label>
          <div className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-600 text-gray-500 dark:text-gray-400">
            Warten auf Kategorieauswahl...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Kategorie
        </label>
        {!showNewCategory ? (
          <div className="space-y-2">
            <select
              key={`category-${Object.keys(structure).length}`}
              value={category || ""}
              onChange={(e) => {
                onCategoryChange(e.target.value);
                onSubcategoryChange('');
              }}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value="">Kategorie wählen...</option>
              {Object.keys(structure || {}).map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => setShowNewCategory(true)}
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              + Neue Kategorie erstellen
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex gap-2">
              <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Neue Kategorie..."
                className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                autoFocus
              />
              <button
                onClick={handleCreateCategory}
                className="px-4 py-2 bg-green-600 dark:bg-green-700 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-600"
              >
                Erstellen
              </button>
              <button
                onClick={() => {
                  setShowNewCategory(false);
                  setNewCategory('');
                }}
                className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500"
              >
                Abbrechen
              </button>
            </div>
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Unterkategorie
        </label>
        {!showNewSubcategory ? (
          <div className="space-y-2">
            <select
              key={`subcategory-${category}-${category && structure[category] ? Object.keys(structure[category]).length : 0}`}
              value={subcategory || ""}
              onChange={(e) => {
                onSubcategoryChange(e.target.value);
              }}
              disabled={!category}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 disabled:bg-gray-100 dark:disabled:bg-gray-600 disabled:cursor-not-allowed"
            >
              <option value="">Unterkategorie wählen...</option>
              {category && structure && structure[category] && Object.keys(structure[category]).map(subcat => (
                <option key={subcat} value={subcat}>{subcat}</option>
              ))}
            </select>
            {category && (
              <button
                type="button"
                onClick={() => setShowNewSubcategory(true)}
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                + Neue Unterkategorie erstellen
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex gap-2">
              <input
                type="text"
                value={newSubcategory}
                onChange={(e) => setNewSubcategory(e.target.value)}
                placeholder="Neue Unterkategorie..."
                className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                autoFocus
              />
              <button
                onClick={handleCreateSubcategory}
                className="px-4 py-2 bg-green-600 dark:bg-green-700 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-600"
              >
                Erstellen
              </button>
              <button
                onClick={() => {
                  setShowNewSubcategory(false);
                  setNewSubcategory('');
                }}
                className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500"
              >
                Abbrechen
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
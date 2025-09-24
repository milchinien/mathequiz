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

  useEffect(() => {
    fetchQuizStructure();
  }, []);

  const fetchQuizStructure = async () => {
    try {
      const response = await fetch('/api/quizzes');
      const data = await response.json();
      setStructure(data);
    } catch (error) {
      console.error('Error fetching quiz structure:', error);
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
        await fetchQuizStructure();
        onCategoryChange(newCategory.trim());
        setNewCategory('');
        setShowNewCategory(false);
      }
    } catch (error) {
      console.error('Error creating category:', error);
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
        await fetchQuizStructure();
        onSubcategoryChange(newSubcategory.trim());
        setNewSubcategory('');
        setShowNewSubcategory(false);
      }
    } catch (error) {
      console.error('Error creating subcategory:', error);
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Kategorie
        </label>
        {!showNewCategory ? (
          <div className="space-y-2">
            <select
              value={category}
              onChange={(e) => {
                onCategoryChange(e.target.value);
                onSubcategoryChange('');
              }}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Kategorie wählen...</option>
              {Object.keys(structure).map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => setShowNewCategory(true)}
              className="text-sm text-blue-600 hover:underline"
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
                className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
              <button
                onClick={handleCreateCategory}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Erstellen
              </button>
              <button
                onClick={() => {
                  setShowNewCategory(false);
                  setNewCategory('');
                }}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
              >
                Abbrechen
              </button>
            </div>
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Unterkategorie
        </label>
        {!showNewSubcategory ? (
          <div className="space-y-2">
            <select
              value={subcategory}
              onChange={(e) => onSubcategoryChange(e.target.value)}
              disabled={!category}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="">Unterkategorie wählen...</option>
              {category && structure[category] && Object.keys(structure[category]).map(subcat => (
                <option key={subcat} value={subcat}>{subcat}</option>
              ))}
            </select>
            {category && (
              <button
                type="button"
                onClick={() => setShowNewSubcategory(true)}
                className="text-sm text-blue-600 hover:underline"
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
                className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
              <button
                onClick={handleCreateSubcategory}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Erstellen
              </button>
              <button
                onClick={() => {
                  setShowNewSubcategory(false);
                  setNewSubcategory('');
                }}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
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
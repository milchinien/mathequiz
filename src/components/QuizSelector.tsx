'use client';

import { useState, useEffect } from 'react';
import { QuizStructure } from '@/types/quiz';
import Link from 'next/link';
import ModeToggle from '@/components/ModeToggle';
import { useViewMode } from '@/contexts/ViewModeContext';
import SidebarQuizSelector from '@/components/SidebarQuizSelector';
import ViewModeToggle from '@/components/ViewModeToggle';

export default function QuizSelector() {
  const { viewMode } = useViewMode();

  // If sidebar mode is selected, render the SidebarQuizSelector
  if (viewMode === 'sidebar') {
    return <SidebarQuizSelector />;
  }

  // Otherwise, render the original grid-based QuizSelector
  return <GridQuizSelector />;
}

function GridQuizSelector() {
  const [structure, setStructure] = useState<QuizStructure>({});
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<'immediate' | 'summary'>('immediate');
  const [editingCategory, setEditingCategory] = useState<string>('');
  const [editingSubcategory, setEditingSubcategory] = useState<string>('');
  const [editName, setEditName] = useState<string>('');
  const [confirmDelete, setConfirmDelete] = useState<{type: string, name: string, category?: string} | null>(null);

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

  const handleEditCategory = (categoryName: string) => {
    setEditingCategory(categoryName);
    setEditName(categoryName);
  };

  const handleEditSubcategory = (subcategoryName: string) => {
    setEditingSubcategory(subcategoryName);
    setEditName(subcategoryName);
  };

  const handleSaveEdit = async (type: 'category' | 'subcategory') => {
    if (!editName.trim()) return;

    try {
      const response = await fetch('/api/categories', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          oldName: type === 'category' ? editingCategory : editingSubcategory,
          newName: editName.trim(),
          type,
          category: type === 'subcategory' ? selectedCategory : undefined
        })
      });

      if (response.ok) {
        await fetchQuizStructure();
        if (type === 'category') {
          setSelectedCategory(editName.trim());
          setEditingCategory('');
        } else {
          setSelectedSubcategory(editName.trim());
          setEditingSubcategory('');
        }
        setEditName('');
      }
    } catch (error) {
      console.error('Error updating:', error);
    }
  };

  const handleCancelEdit = () => {
    setEditingCategory('');
    setEditingSubcategory('');
    setEditName('');
  };

  const handleDeleteConfirm = (type: string, name: string, category?: string) => {
    setConfirmDelete({ type, name, category });
  };

  const handleDeleteExecute = async () => {
    if (!confirmDelete) return;

    try {
      if (confirmDelete.type === 'quiz') {
        const response = await fetch('/api/quiz-management', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            category: confirmDelete.category,
            subcategory: selectedSubcategory,
            filename: confirmDelete.name
          })
        });

        if (response.ok) {
          await fetchQuizStructure();
        }
      } else {
        const response = await fetch('/api/categories', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: confirmDelete.name,
            type: confirmDelete.type,
            category: confirmDelete.category
          })
        });

        if (response.ok) {
          await fetchQuizStructure();
          if (confirmDelete.type === 'category' && selectedCategory === confirmDelete.name) {
            setSelectedCategory('');
            setSelectedSubcategory('');
          } else if (confirmDelete.type === 'subcategory' && selectedSubcategory === confirmDelete.name) {
            setSelectedSubcategory('');
          }
        }
      }

      setConfirmDelete(null);
    } catch (error) {
      console.error('Error deleting:', error);
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
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Quiz-Auswahl</h1>
        <ViewModeToggle />
      </div>

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
                {editingCategory === category ? (
                  <div className="flex items-center gap-2 p-2">
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="flex-1 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSaveEdit('category');
                        if (e.key === 'Escape') handleCancelEdit();
                      }}
                    />
                    <button
                      onClick={() => handleSaveEdit('category')}
                      className="p-1 text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300"
                      title="Speichern"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      title="Abbrechen"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ) : (
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
                        onClick={() => handleEditCategory(category)}
                        className="p-1 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        title="Kategorie bearbeiten"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDeleteConfirm('category', category)}
                        className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                        title="Kategorie löschen"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}
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
                  {editingSubcategory === subcategory ? (
                    <div className="flex items-center gap-2 p-2">
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="flex-1 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSaveEdit('subcategory');
                          if (e.key === 'Escape') handleCancelEdit();
                        }}
                      />
                      <button
                        onClick={() => handleSaveEdit('subcategory')}
                        className="p-1 text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300"
                        title="Speichern"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        title="Abbrechen"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ) : (
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
                          onClick={() => handleEditSubcategory(subcategory)}
                          className="p-1 text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                          title="Unterkategorie bearbeiten"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeleteConfirm('subcategory', subcategory, selectedCategory)}
                          className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                          title="Unterkategorie löschen"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  )}
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
                      <Link
                        href={`/edit?category=${selectedCategory}&subcategory=${selectedSubcategory}&quiz=${quiz}`}
                        className="p-1 text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                        title="Quiz bearbeiten"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </Link>
                      <button
                        onClick={() => handleDeleteConfirm('quiz', quiz, selectedCategory)}
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

      {/* Confirmation Dialog */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
              {confirmDelete.type === 'category' ? 'Kategorie' :
               confirmDelete.type === 'subcategory' ? 'Unterkategorie' : 'Quiz'} löschen
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Sind Sie sicher, dass Sie &quot;{confirmDelete.name}&quot; löschen möchten?
              {confirmDelete.type !== 'quiz' && ' Alle enthaltenen Inhalte werden ebenfalls gelöscht.'}
              <br />
              <strong>Diese Aktion kann nicht rückgängig gemacht werden.</strong>
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setConfirmDelete(null)}
                className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
              >
                Abbrechen
              </button>
              <button
                onClick={handleDeleteExecute}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                Löschen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
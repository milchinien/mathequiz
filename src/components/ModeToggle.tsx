'use client';

interface ModeToggleProps {
  mode: 'immediate' | 'summary';
  onModeChange: (mode: 'immediate' | 'summary') => void;
}

export default function ModeToggle({ mode, onModeChange }: ModeToggleProps) {
  return (
    <div className="flex items-center justify-center mb-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-2 flex">
        <button
          onClick={() => onModeChange('immediate')}
          className={`px-4 py-2 rounded-md transition-colors ${
            mode === 'immediate'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          Sofort-Feedback
        </button>
        <button
          onClick={() => onModeChange('summary')}
          className={`px-4 py-2 rounded-md transition-colors ml-2 ${
            mode === 'summary'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          Zusammenfassung am Ende
        </button>
      </div>
    </div>
  );
}
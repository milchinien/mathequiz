'use client';

interface ModeToggleProps {
  mode: 'immediate' | 'summary';
  onModeChange: (mode: 'immediate' | 'summary') => void;
}

export default function ModeToggle({ mode, onModeChange }: ModeToggleProps) {
  return (
    <div className="flex items-center justify-center mb-6">
      <div className="bg-white rounded-lg shadow-md p-2 flex">
        <button
          onClick={() => onModeChange('immediate')}
          className={`px-4 py-2 rounded-md transition-colors ${
            mode === 'immediate'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Sofort-Feedback
        </button>
        <button
          onClick={() => onModeChange('summary')}
          className={`px-4 py-2 rounded-md transition-colors ml-2 ${
            mode === 'summary'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Zusammenfassung am Ende
        </button>
      </div>
    </div>
  );
}
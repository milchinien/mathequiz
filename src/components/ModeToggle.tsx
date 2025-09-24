'use client';

interface ModeToggleProps {
  mode: 'immediate' | 'summary';
  onModeChange: (mode: 'immediate' | 'summary') => void;
}

export default function ModeToggle({ mode, onModeChange }: ModeToggleProps) {
  const isImmediate = mode === 'immediate';

  const handleToggle = () => {
    onModeChange(isImmediate ? 'summary' : 'immediate');
  };

  return (
    <div className="flex items-center justify-center mb-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 flex items-center gap-3">
        <label className="flex items-center gap-3 cursor-pointer">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Sofort-Feedback
          </span>
          <div className="relative">
            <input
              type="checkbox"
              checked={isImmediate}
              onChange={handleToggle}
              className="sr-only"
            />
            <div
              className={`w-11 h-6 rounded-full transition-colors duration-200 ease-in-out ${
                isImmediate
                  ? 'bg-green-500'
                  : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white shadow-md transform transition-transform duration-200 ease-in-out ${
                  isImmediate ? 'translate-x-6' : 'translate-x-1'
                } absolute top-1 left-0`}
              />
            </div>
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {isImmediate ? 'Ein' : 'Aus'}
          </span>
        </label>
      </div>
    </div>
  );
}
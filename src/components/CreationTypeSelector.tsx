'use client';

export interface CreationTypeSelection {
  type: 'category' | 'subcategory' | 'quiz';
}

interface CreationTypeSelectorProps {
  onSelectionChange: (selection: CreationTypeSelection) => void;
}

export default function CreationTypeSelector({ onSelectionChange }: CreationTypeSelectorProps) {
  const creationTypes = [
    {
      type: 'category' as const,
      title: 'Kategorie erstellen',
      description: 'Eine neue Hauptkategorie anlegen',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z" />
        </svg>
      ),
      color: 'blue'
    },
    {
      type: 'subcategory' as const,
      title: 'Unterkategorie erstellen',
      description: 'Eine neue Unterkategorie in einer bestehenden Kategorie anlegen',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6" />
        </svg>
      ),
      color: 'green'
    },
    {
      type: 'quiz' as const,
      title: 'Quiz erstellen',
      description: 'Ein neues Quiz in einer bestehenden Unterkategorie erstellen',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      color: 'purple'
    }
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue':
        return {
          bg: 'bg-blue-50 dark:bg-blue-900/20',
          border: 'border-blue-200 dark:border-blue-800',
          hover: 'hover:bg-blue-100 dark:hover:bg-blue-900/40',
          icon: 'text-blue-600 dark:text-blue-400',
          text: 'text-blue-700 dark:text-blue-300'
        };
      case 'green':
        return {
          bg: 'bg-green-50 dark:bg-green-900/20',
          border: 'border-green-200 dark:border-green-800',
          hover: 'hover:bg-green-100 dark:hover:bg-green-900/40',
          icon: 'text-green-600 dark:text-green-400',
          text: 'text-green-700 dark:text-green-300'
        };
      case 'purple':
        return {
          bg: 'bg-purple-50 dark:bg-purple-900/20',
          border: 'border-purple-200 dark:border-purple-800',
          hover: 'hover:bg-purple-100 dark:hover:bg-purple-900/40',
          icon: 'text-purple-600 dark:text-purple-400',
          text: 'text-purple-700 dark:text-purple-300'
        };
      default:
        return {
          bg: 'bg-gray-50 dark:bg-gray-900/20',
          border: 'border-gray-200 dark:border-gray-800',
          hover: 'hover:bg-gray-100 dark:hover:bg-gray-900/40',
          icon: 'text-gray-600 dark:text-gray-400',
          text: 'text-gray-700 dark:text-gray-300'
        };
    }
  };

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {creationTypes.map((type) => {
        const colors = getColorClasses(type.color);
        return (
          <button
            key={type.type}
            onClick={() => onSelectionChange({ type: type.type })}
            className={`p-6 rounded-lg border-2 transition-all duration-200 text-left ${colors.bg} ${colors.border} ${colors.hover} hover:shadow-md`}
          >
            <div className={`flex items-center mb-4 ${colors.icon}`}>
              {type.icon}
              <h3 className={`ml-3 text-lg font-semibold ${colors.text}`}>
                {type.title}
              </h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {type.description}
            </p>
          </button>
        );
      })}
    </div>
  );
}
'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import OptionsDropdown from './OptionsDropdown';

export default function TaskBar() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(path);
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          {/* Tabs links */}
          <div className="flex space-x-6">
            <Link
              href="/"
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                isActive('/')
                  ? 'bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-white/50 dark:hover:bg-gray-700/50'
              }`}
            >
              Lernen
            </Link>
            <Link
              href="/generate"
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                isActive('/generate')
                  ? 'bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-white/50 dark:hover:bg-gray-700/50'
              }`}
            >
              Quiz erstellen
            </Link>
            <Link
              href="/edit"
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                isActive('/edit')
                  ? 'bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-white/50 dark:hover:bg-gray-700/50'
              }`}
            >
              Quiz bearbeiten
            </Link>
          </div>

          {/* Drei Punkte rechts */}
          <OptionsDropdown />
        </div>
      </div>
    </div>
  );
}
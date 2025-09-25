'use client';

import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import OptionsDropdown from './OptionsDropdown';
import { useUser } from '@/contexts/UserContext';

export default function TaskBar() {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser } = useUser();

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
            <Link
              href="/history"
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                isActive('/history')
                  ? 'bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-white/50 dark:hover:bg-gray-700/50'
              }`}
            >
              Historie
            </Link>
          </div>

          {/* Profile Picture and Options */}
          <div className="flex items-center space-x-3">
            {currentUser && (
              <button
                onClick={() => router.push('/profile')}
                className="w-8 h-8 rounded-full bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 flex items-center justify-center text-white font-semibold text-sm transition-colors"
                aria-label="Profil anzeigen"
              >
                {currentUser.charAt(0).toUpperCase()}
              </button>
            )}
            <OptionsDropdown />
          </div>
        </div>
      </div>
    </div>
  );
}
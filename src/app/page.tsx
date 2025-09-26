'use client';

import { useProtectedRoute } from '@/hooks/useProtectedRoute';
import QuizSelector from '@/components/QuizSelector';

export default function Home() {
  const { isAuthenticated, currentUser, isLoading } = useProtectedRoute();

  // Show loading while redirecting
  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Weiterleitung zur Anmeldung...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Willkommen zurück!
              </h1>
              <div className="flex items-center mt-2">
                <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-semibold mr-2">
                  {currentUser?.charAt(0).toUpperCase()}
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                  Angemeldet als <span className="font-medium text-gray-900 dark:text-gray-100">{currentUser}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
        <QuizSelector />
      </div>
    </main>
  );
}

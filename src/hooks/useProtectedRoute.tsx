'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/UserContext';

export function useProtectedRoute() {
  const { currentUser, isSessionValid, checkSession } = useUser();
  const router = useRouter();

  useEffect(() => {
    // Check session validity on mount
    if (currentUser) {
      const sessionValid = checkSession();
      if (!sessionValid) {
        router.push('/login');
      }
    } else if (typeof window !== 'undefined') {
      // Only redirect on client side
      router.push('/login');
    }
  }, [currentUser, checkSession, router]);

  // Check session periodically (every 5 minutes)
  useEffect(() => {
    const interval = setInterval(() => {
      if (!checkSession()) {
        router.push('/login');
      }
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [checkSession, router]);

  // Return loading state and user info
  return {
    isAuthenticated: !!currentUser && isSessionValid,
    currentUser,
    isLoading: (!currentUser || !isSessionValid) && typeof window !== 'undefined' // Will be true during redirect
  };
}

// Higher-order component for protected routes
export function withProtectedRoute<T extends object>(
  WrappedComponent: React.ComponentType<T>
) {
  return function ProtectedComponent(props: T) {
    const { isAuthenticated, isLoading } = useProtectedRoute();

    if (isLoading || !isAuthenticated) {
      return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">
              {isLoading ? 'Weiterleitung zur Anmeldung...' : 'Authentifizierung erforderlich...'}
            </p>
          </div>
        </div>
      );
    }

    return <WrappedComponent {...props} />;
  };
}
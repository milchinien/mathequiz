'use client';

import React, { useState, useEffect } from 'react';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';
import { useHistory } from '@/contexts/HistoryContext';
import Link from 'next/link';

export default function ProfilePage() {
  const { isAuthenticated, currentUser, isLoading } = useProtectedRoute();
  const { sessions, clearHistory } = useHistory();
  const [showDebug, setShowDebug] = useState(false);

  // Calculate statistics - Simple system: 1 point per completed quiz
  const userSessions = sessions.filter(session => session.user === currentUser);
  const completedQuizzes = userSessions.length; // Each session = 1 completed quiz = 1 point
  const totalPoints = completedQuizzes; // 1 point per completed quiz

  // Debug logging (only when data changes)
  useEffect(() => {
    if (currentUser && sessions.length > 0) {
      console.log('Profile Debug:', {
        currentUser,
        totalSessions: sessions.length,
        userSessions: userSessions.length,
        completedQuizzes
      });
    }
  }, [currentUser, sessions.length, userSessions.length, completedQuizzes]);

  // Show loading while checking authentication
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
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-6">
          <Link href="/" className="text-blue-600 dark:text-blue-400 hover:underline">
            ← Zurück zur Übersicht
          </Link>
        </div>

        {/* Profile Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 mb-6">
          <div className="text-center">
            {/* Large Profile Picture */}
            <div className="w-24 h-24 rounded-full bg-blue-500 dark:bg-blue-600 flex items-center justify-center text-white font-bold text-3xl mx-auto mb-4">
              {currentUser?.charAt(0).toUpperCase()}
            </div>

            {/* User Name */}
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              {currentUser}
            </h1>

            <p className="text-gray-600 dark:text-gray-400">
              Benutzer seit {new Date().toLocaleDateString('de-DE')}
            </p>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Total Points */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Gesamtpunkte
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  1 Punkt pro abgeschlossenem Quiz
                </p>
              </div>
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {totalPoints}
              </div>
            </div>
          </div>

          {/* Completed Quizzes */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Abgeschlossene Quizzes
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Anzahl vollständig absolvierter Quizzes
                </p>
              </div>
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                {completedQuizzes}
              </div>
            </div>
          </div>
        </div>

        {/* Additional Stats */}
        {completedQuizzes > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Quiz-Verlauf
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {userSessions.length > 0 ? new Date(Math.max(...userSessions.map(s => new Date(s.timestamp).getTime()))).toLocaleDateString('de-DE') : 'Nie'}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Letztes Quiz</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {userSessions.length > 0 ? Math.round(userSessions.reduce((total, session) => total + (session.duration || 0), 0) / userSessions.length / 60) : 0}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">∅ Dauer (Min.)</p>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {completedQuizzes === 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
            <div className="text-gray-400 dark:text-gray-500 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Noch keine Quizzes absolviert
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Beginne mit deinem ersten Quiz, um hier Statistiken zu sehen.
            </p>
            <Link
              href="/"
              className="inline-block px-6 py-3 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition"
            >
              Quiz auswählen
            </Link>
          </div>
        )}

        {/* Debug Section - Temporary */}
        <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 mt-6">
          <button
            onClick={() => setShowDebug(!showDebug)}
            className="text-sm text-red-600 dark:text-red-400 underline mb-2"
          >
            Debug Info {showDebug ? 'verstecken' : 'anzeigen'}
          </button>

          {showDebug && (
            <div className="text-xs text-red-800 dark:text-red-200 space-y-2">
              <p>Aktueller Benutzer: {currentUser}</p>
              <p>Gesamt Sessions: {sessions.length}</p>
              <p>User Sessions: {userSessions.length}</p>
              <p>Completed Quizzes: {completedQuizzes}</p>
              <p>Total Points: {totalPoints}</p>
              <button
                onClick={() => {
                  if (confirm('Alle Historie-Daten löschen? Dies kann nicht rückgängig gemacht werden.')) {
                    clearHistory();
                    window.location.reload();
                  }
                }}
                className="bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700 mt-2"
              >
                Historie löschen (Vorsicht!)
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
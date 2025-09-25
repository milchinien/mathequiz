'use client';

import { useState, useMemo } from 'react';
import { useUser } from '@/contexts/UserContext';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';
import { useHistory } from '@/contexts/HistoryContext';
import { QuizSession } from '@/types/user';
import { useDarkMode } from '@/contexts/DarkModeContext';
import Link from 'next/link';

export default function HistoryPage() {
  const { isAuthenticated, isLoading } = useProtectedRoute();
  const { currentUser, users } = useUser();
  const { sessions, deleteSession, clearHistory } = useHistory();
  const { isDarkMode } = useDarkMode();
  const [selectedUser, setSelectedUser] = useState<string>('all');
  const [selectedSession, setSelectedSession] = useState<QuizSession | null>(null);

  // Filter sessions based on selected user
  const filteredSessions = useMemo(() => {
    if (selectedUser === 'all') {
      return sessions;
    }
    if (selectedUser === 'current' && currentUser) {
      return sessions.filter(session => session.user === currentUser);
    }
    return sessions.filter(session => session.user === selectedUser);
  }, [sessions, selectedUser, currentUser]);

  // Sort sessions by timestamp (newest first)
  const sortedSessions = useMemo(() => {
    return [...filteredSessions].sort((a, b) =>
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }, [filteredSessions]);

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleString('de-DE');
  };

  const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600 dark:text-green-400';
    if (percentage >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

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

  if (selectedSession) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="mb-6 flex items-center justify-between">
            <button
              onClick={() => setSelectedSession(null)}
              className="text-blue-600 dark:text-blue-400 hover:underline flex items-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Zurück zur Übersicht
            </button>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Quiz-Session Details
            </h1>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Benutzer</p>
                <p className="font-semibold text-gray-900 dark:text-gray-100">{selectedSession.user}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Datum</p>
                <p className="font-semibold text-gray-900 dark:text-gray-100">
                  {formatDate(selectedSession.timestamp)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Ergebnis</p>
                <p className={`font-semibold ${getScoreColor(selectedSession.score.percentage)}`}>
                  {selectedSession.score.correct}/{selectedSession.score.total} ({selectedSession.score.percentage}%)
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Dauer</p>
                <p className="font-semibold text-gray-900 dark:text-gray-100">
                  {selectedSession.duration ? formatDuration(selectedSession.duration) : 'N/A'}
                </p>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Quiz: {selectedSession.quiz.name}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {selectedSession.quiz.category} → {selectedSession.quiz.subcategory}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                Modus: {selectedSession.mode === 'immediate' ? 'Sofort-Feedback' : 'Zusammenfassung'}
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Fragen & Antworten
            </h3>
            <div className="space-y-4">
              {selectedSession.questions.map((q, index) => (
                <div key={index} className={`p-4 rounded-lg border ${
                  q.isCorrect
                    ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                    : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                }`}>
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-gray-900 dark:text-gray-100">
                      Frage {index + 1}
                    </h4>
                    <span className={`px-2 py-1 text-xs rounded font-medium ${
                      q.isCorrect
                        ? 'bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-100'
                        : 'bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-100'
                    }`}>
                      {q.isCorrect ? 'Richtig' : 'Falsch'}
                    </span>
                  </div>
                  <p className="text-gray-800 dark:text-gray-200 mb-3">{q.question}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                        Deine Antwort{q.userAnswers.length > 1 ? 'en' : ''}:
                      </p>
                      <ul className="text-sm text-gray-800 dark:text-gray-200">
                        {q.userAnswers.map((answer, i) => (
                          <li key={i} className="flex items-center">
                            <span className="w-2 h-2 bg-blue-400 rounded-full mr-2 flex-shrink-0"></span>
                            {answer}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                        Richtige Antwort{q.correctAnswers.length > 1 ? 'en' : ''}:
                      </p>
                      <ul className="text-sm text-gray-800 dark:text-gray-200">
                        {q.correctAnswers.map((answer, i) => (
                          <li key={i} className="flex items-center">
                            <span className="w-2 h-2 bg-green-400 rounded-full mr-2 flex-shrink-0"></span>
                            {answer}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Quiz-Historie</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Übersicht aller gespielten Quiz-Sessions
          </p>
        </div>

        {/* Filter Controls */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Benutzer filtern:
              </label>
              <select
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Alle Benutzer</option>
                {currentUser && (
                  <option value="current">Aktueller Benutzer ({currentUser})</option>
                )}
                {users.map(user => (
                  <option key={user.name} value={user.name}>
                    {user.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end gap-4">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {sortedSessions.length} Session{sortedSessions.length !== 1 ? 's' : ''} gefunden
              </div>
              {sessions.length > 0 && (
                <button
                  onClick={() => {
                    if (confirm('Möchten Sie wirklich ALLE Quiz-Historie löschen? Diese Aktion kann nicht rückgängig gemacht werden.')) {
                      clearHistory();
                    }
                  }}
                  className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg transition-colors"
                >
                  Alle Historie löschen
                </button>
              )}
            </div>
          </div>
        </div>

        {sortedSessions.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
            <div className="text-gray-500 dark:text-gray-400">
              <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-lg mb-2">Keine Quiz-Sessions gefunden</p>
              <p className="text-sm">
                {selectedUser === 'all'
                  ? 'Spiele ein Quiz, um deine erste Session zu erstellen.'
                  : `Keine Sessions für ${selectedUser === 'current' ? 'den aktuellen Benutzer' : selectedUser} gefunden.`
                }
              </p>
              <Link href="/" className="inline-block mt-4 text-blue-600 dark:text-blue-400 hover:underline">
                Zum Quiz-Bereich
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {sortedSessions.map((session) => (
              <div
                key={session.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow relative group"
              >
                {/* Delete Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm(`Quiz "${session.quiz.name}" aus der Historie löschen?`)) {
                      deleteSession(session.id);
                    }
                  }}
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-red-600 hover:bg-red-700 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                  title="Quiz löschen"
                >
                  ✗
                </button>

                {/* Clickable content area */}
                <div
                  className="cursor-pointer"
                  onClick={() => setSelectedSession(session)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-semibold mr-3">
                        {session.user.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">{session.user}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {formatDate(session.timestamp)}
                        </p>
                      </div>
                    </div>
                    <div className={`text-right ${getScoreColor(session.score.percentage)}`}>
                      <div className="font-bold">{session.score.percentage}%</div>
                      <div className="text-xs">
                        {session.score.correct}/{session.score.total}
                      </div>
                    </div>
                  </div>

                <div className="mb-3">
                  <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-1">
                    {session.quiz.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {session.quiz.category} → {session.quiz.subcategory}
                  </p>
                </div>

                  <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
                    <span>
                      {session.mode === 'immediate' ? 'Sofort-Feedback' : 'Zusammenfassung'}
                    </span>
                    <span>
                      {session.duration ? formatDuration(session.duration) : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
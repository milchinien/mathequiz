'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { QuizSession } from '@/types/user';

interface HistoryContextType {
  sessions: QuizSession[];
  addSession: (session: QuizSession) => Promise<void>;
  getSessionsByUser: (username: string) => QuizSession[];
  getSessionById: (id: string) => QuizSession | undefined;
  deleteSession: (id: string, username: string) => Promise<void>;
  clearHistory: () => void;
}

const HistoryContext = createContext<HistoryContextType | undefined>(undefined);

export function HistoryProvider({ children }: { children: React.ReactNode }) {
  const [sessions, setSessions] = useState<QuizSession[]>([]);

  useEffect(() => {
    // Load sessions from API (with fallback to localStorage)
    const loadSessions = async () => {
      try {
        const response = await fetch('/api/history');
        if (response.ok) {
          const sessionsFromAPI = await response.json();
          setSessions(sessionsFromAPI);
          // Sync to localStorage as backup
          localStorage.setItem('mathequiz_history', JSON.stringify(sessionsFromAPI));
        } else {
          throw new Error('Failed to fetch history from API');
        }
      } catch (error) {
        console.error('Error loading history from API, falling back to localStorage:', error);
        // Fallback to localStorage
        const savedSessions = localStorage.getItem('mathequiz_history');
        if (savedSessions) {
          try {
            const parsedSessions = JSON.parse(savedSessions);
            setSessions(parsedSessions);
          } catch (error) {
            console.error('Error parsing saved sessions:', error);
            setSessions([]);
          }
        }
      }
    };

    loadSessions();
  }, []);

  const saveSessions = (sessions: QuizSession[]) => {
    localStorage.setItem('mathequiz_history', JSON.stringify(sessions));
  };

  const addSession = useCallback(async (session: QuizSession) => {
    // Save to API first
    try {
      const response = await fetch('/api/history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(session)
      });

      if (!response.ok) {
        throw new Error('Failed to save session to API');
      }
    } catch (error) {
      console.error('Error saving session to API:', error);
    }

    // Update local state
    setSessions(prevSessions => {
      const updatedSessions = [session, ...prevSessions];
      // Keep only the latest 1000 sessions to prevent localStorage from growing too large
      const limitedSessions = updatedSessions.slice(0, 1000);
      saveSessions(limitedSessions);
      return limitedSessions;
    });
  }, []);

  const getSessionsByUser = useCallback((username: string): QuizSession[] => {
    return sessions.filter(session => session.user === username);
  }, [sessions]);

  const getSessionById = useCallback((id: string): QuizSession | undefined => {
    return sessions.find(session => session.id === id);
  }, [sessions]);

  const deleteSession = useCallback(async (id: string, username: string) => {
    // Delete from API first
    try {
      await fetch(`/api/history?id=${id}&user=${username}`, {
        method: 'DELETE'
      });
    } catch (error) {
      console.error('Error deleting session from API:', error);
    }

    // Update local state
    setSessions(prevSessions => {
      const updatedSessions = prevSessions.filter(session => session.id !== id);
      saveSessions(updatedSessions);
      return updatedSessions;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setSessions([]);
    localStorage.removeItem('mathequiz_history');
  }, []);

  return (
    <HistoryContext.Provider value={{
      sessions,
      addSession,
      getSessionsByUser,
      getSessionById,
      deleteSession,
      clearHistory
    }}>
      {children}
    </HistoryContext.Provider>
  );
}

export function useHistory() {
  const context = useContext(HistoryContext);
  if (context === undefined) {
    throw new Error('useHistory must be used within a HistoryProvider');
  }
  return context;
}

// Utility function to generate unique session IDs
export function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
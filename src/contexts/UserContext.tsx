'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User, UserSession } from '@/types/user';

interface UserContextType {
  currentUser: string | null;
  users: User[];
  isSessionValid: boolean;
  setCurrentUser: (username: string) => void;
  addUser: (username: string) => void;
  removeUser: (username: string) => void;
  logout: () => void;
  checkSession: () => boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUserState] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [isSessionValid, setIsSessionValid] = useState(false);

  // Session duration: 4 hours
  const SESSION_DURATION = 4 * 60 * 60 * 1000;

  const checkSession = (): boolean => {
    const savedSession = localStorage.getItem('mathequiz_session');
    if (!savedSession) return false;

    try {
      const session: UserSession = JSON.parse(savedSession);
      const now = new Date().getTime();
      const expiresAt = new Date(session.expiresAt).getTime();

      if (now < expiresAt) {
        return true;
      } else {
        // Session expired, clean up
        localStorage.removeItem('mathequiz_session');
        localStorage.removeItem('mathequiz_current_user');
        return false;
      }
    } catch (error) {
      console.error('Error parsing session:', error);
      localStorage.removeItem('mathequiz_session');
      return false;
    }
  };

  useEffect(() => {
    // Load users and current user from localStorage
    const savedUsers = localStorage.getItem('mathequiz_users');

    if (savedUsers) {
      try {
        const parsedUsers = JSON.parse(savedUsers);
        // Filter out users with empty or invalid names
        const validUsers = parsedUsers.filter((user: User) =>
          user.name && user.name.trim().length > 0
        );
        setUsers(validUsers);
        // Save cleaned users back to localStorage
        if (validUsers.length !== parsedUsers.length) {
          localStorage.setItem('mathequiz_users', JSON.stringify(validUsers));
        }
      } catch (error) {
        console.error('Error parsing saved users:', error);
        setUsers([]);
      }
    }

    // Check if there's a valid session
    const sessionValid = checkSession();
    setIsSessionValid(sessionValid);

    if (sessionValid) {
      const savedSession = localStorage.getItem('mathequiz_session');
      if (savedSession) {
        try {
          const session: UserSession = JSON.parse(savedSession);
          setCurrentUserState(session.username);
        } catch (error) {
          console.error('Error restoring session:', error);
          setIsSessionValid(false);
        }
      }
    }
  }, []);

  const setCurrentUser = (username: string) => {
    // If empty username, treat as logout
    if (!username || username.trim() === '') {
      logout();
      return;
    }

    const trimmedUsername = username.trim();
    setCurrentUserState(trimmedUsername);
    setIsSessionValid(true);

    // Create session
    const now = new Date();
    const expiresAt = new Date(now.getTime() + SESSION_DURATION);
    const session: UserSession = {
      username: trimmedUsername,
      loginTime: now.toISOString(),
      expiresAt: expiresAt.toISOString()
    };

    localStorage.setItem('mathequiz_current_user', trimmedUsername);
    localStorage.setItem('mathequiz_session', JSON.stringify(session));

    // Update or add user with new lastUsed timestamp
    const nowISO = now.toISOString();
    setUsers(prevUsers => {
      const existingUserIndex = prevUsers.findIndex(u => u.name === trimmedUsername);
      let updatedUsers;

      if (existingUserIndex >= 0) {
        // Update existing user
        updatedUsers = [...prevUsers];
        updatedUsers[existingUserIndex] = { ...updatedUsers[existingUserIndex], lastUsed: nowISO };
      } else {
        // Add new user
        updatedUsers = [...prevUsers, { name: trimmedUsername, lastUsed: nowISO }];
      }

      // Sort by lastUsed (most recent first)
      updatedUsers.sort((a, b) => new Date(b.lastUsed).getTime() - new Date(a.lastUsed).getTime());

      localStorage.setItem('mathequiz_users', JSON.stringify(updatedUsers));
      return updatedUsers;
    });
  };

  const addUser = (username: string) => {
    const now = new Date().toISOString();
    const newUser: User = { name: username, lastUsed: now };

    setUsers(prevUsers => {
      const existingUser = prevUsers.find(u => u.name === username);
      if (existingUser) {
        return prevUsers; // User already exists
      }

      const updatedUsers = [...prevUsers, newUser];
      updatedUsers.sort((a, b) => new Date(b.lastUsed).getTime() - new Date(a.lastUsed).getTime());

      localStorage.setItem('mathequiz_users', JSON.stringify(updatedUsers));
      return updatedUsers;
    });
  };

  const removeUser = (username: string) => {
    setUsers(prevUsers => {
      const updatedUsers = prevUsers.filter(u => u.name !== username);
      localStorage.setItem('mathequiz_users', JSON.stringify(updatedUsers));
      return updatedUsers;
    });

    // If the removed user was the current user, clear current user
    if (currentUser === username) {
      setCurrentUserState(null);
      localStorage.removeItem('mathequiz_current_user');
    }
  };

  const logout = () => {
    setCurrentUserState(null);
    setIsSessionValid(false);
    localStorage.removeItem('mathequiz_current_user');
    localStorage.removeItem('mathequiz_session');
  };

  return (
    <UserContext.Provider value={{
      currentUser,
      users,
      isSessionValid,
      setCurrentUser,
      addUser,
      removeUser,
      logout,
      checkSession
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
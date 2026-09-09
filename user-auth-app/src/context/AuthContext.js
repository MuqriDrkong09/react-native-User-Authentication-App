import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const USERS_KEY = '@auth_users';
const SESSION_KEY = '@auth_session';

const AuthContext = createContext(null);

function toSessionUser(user) {
  return { id: user.id, name: user.name, email: user.email };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    restoreSession();
  }, []);

  const restoreSession = async () => {
    try {
      const session = await AsyncStorage.getItem(SESSION_KEY);
      if (session) {
        setUser(JSON.parse(session));
      }
    } catch (error) {
      console.warn('Failed to restore session', error);
    } finally {
      setIsReady(true);
    }
  };

  const signup = async (name, email, password) => {
    const usersJson = await AsyncStorage.getItem(USERS_KEY);
    const users = usersJson ? JSON.parse(usersJson) : [];
    const normalizedEmail = email.trim().toLowerCase();

    const exists = users.some((item) => item.email === normalizedEmail);
    if (exists) {
      throw new Error('An account with this email already exists.');
    }

    const newUser = {
      id: Date.now().toString(),
      name: name.trim(),
      email: normalizedEmail,
      password,
    };

    await AsyncStorage.setItem(USERS_KEY, JSON.stringify([...users, newUser]));
    const sessionUser = toSessionUser(newUser);
    await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));
    setUser(sessionUser);
  };

  const login = async (email, password) => {
    const usersJson = await AsyncStorage.getItem(USERS_KEY);
    const users = usersJson ? JSON.parse(usersJson) : [];
    const normalizedEmail = email.trim().toLowerCase();

    const found = users.find(
      (item) => item.email === normalizedEmail && item.password === password
    );

    if (!found) {
      throw new Error('Incorrect email or password.');
    }

    const sessionUser = toSessionUser(found);
    await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));
    setUser(sessionUser);
  };

  const logout = async () => {
    await AsyncStorage.removeItem(SESSION_KEY);
    setUser(null);
  };

  const value = useMemo(
    () => ({ user, isReady, login, signup, logout }),
    [user, isReady]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

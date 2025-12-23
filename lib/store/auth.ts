"use client";

import { create } from "zustand";

interface AuthState {
  isAuthenticated: boolean;
  user: {
    email: string;
    name: string;
  } | null;
  login: (email: string, name?: string) => void;
  logout: () => void;
}

// Simple localStorage persistence helper
const storage = {
  getItem: (name: string): string | null => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(name);
  },
  setItem: (name: string, value: string): void => {
    if (typeof window === "undefined") return;
    localStorage.setItem(name, value);
  },
  removeItem: (name: string): void => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(name);
  },
};

const getInitialState = (): Partial<AuthState> => {
  if (typeof window === "undefined") {
    return { isAuthenticated: false, user: null };
  }
  const stored = storage.getItem("auth-storage");
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return { isAuthenticated: false, user: null };
    }
  }
  return { isAuthenticated: false, user: null };
};

export const useAuthStore = create<AuthState>((set) => {
  const initialState = getInitialState();
  
  return {
    isAuthenticated: initialState.isAuthenticated ?? false,
    user: initialState.user ?? null,
    login: (email: string, name?: string) => {
      const user = {
        email,
        name: name || email.split("@")[0],
      };
      set({ isAuthenticated: true, user });
      storage.setItem("auth-storage", JSON.stringify({ isAuthenticated: true, user }));
    },
    logout: () => {
      set({ isAuthenticated: false, user: null });
      storage.removeItem("auth-storage");
    },
  };
});

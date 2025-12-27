"use client";

import { create } from "zustand";
import { STORAGE_KEYS } from "@/lib/constants";
import { sanitizeEmail } from "@/lib/utils/sanitize";
import type { User } from "@/lib/types";

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, name?: string) => void;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

// Safe localStorage helper with error handling
const storage = {
  getItem: (name: string): string | null => {
    if (typeof window === "undefined") return null;
    try {
      return localStorage.getItem(name);
    } catch (error) {
      console.error(`Error reading localStorage key "${name}":`, error);
      return null;
    }
  },
  setItem: (name: string, value: string): void => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(name, value);
    } catch (error) {
      console.error(`Error writing localStorage key "${name}":`, error);
      // Handle quota exceeded error
      if (error instanceof DOMException && error.name === "QuotaExceededError") {
        console.warn("LocalStorage quota exceeded. Clearing old data...");
        // Clear old data or handle gracefully
      }
    }
  },
  removeItem: (name: string): void => {
    if (typeof window === "undefined") return;
    try {
      localStorage.removeItem(name);
    } catch (error) {
      console.error(`Error removing localStorage key "${name}":`, error);
    }
  },
};

const getInitialState = (): Partial<AuthState> => {
  if (typeof window === "undefined") {
    return { isAuthenticated: false, user: null };
  }
  const stored = storage.getItem(STORAGE_KEYS.AUTH);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      // Validate stored data structure
      if (parsed && typeof parsed.isAuthenticated === "boolean") {
        return parsed;
      }
    } catch (error) {
      console.error("Error parsing auth storage:", error);
      // Clear corrupted data
      storage.removeItem(STORAGE_KEYS.AUTH);
    }
  }
  return { isAuthenticated: false, user: null };
};

export const useAuthStore = create<AuthState>((set, get) => {
  const initialState = getInitialState();
  
  return {
    isAuthenticated: initialState.isAuthenticated ?? false,
    user: initialState.user ?? null,
    login: (email: string, name?: string) => {
      // Sanitize inputs
      const sanitizedEmail = sanitizeEmail(email);
      const sanitizedName = name ? name.trim().slice(0, 100) : sanitizedEmail.split("@")[0];
      
      const user: User = {
        id: `user-${Date.now()}`, // In production, this would come from API
        email: sanitizedEmail,
        name: sanitizedName,
      };
      
      set({ isAuthenticated: true, user });
      
      try {
        storage.setItem(
          STORAGE_KEYS.AUTH,
          JSON.stringify({ isAuthenticated: true, user })
        );
      } catch (error) {
        console.error("Failed to persist auth state:", error);
        // Continue anyway - state is set in memory
      }
    },
    logout: () => {
      set({ isAuthenticated: false, user: null });
      storage.removeItem(STORAGE_KEYS.AUTH);
    },
    updateUser: (updates: Partial<User>) => {
      const currentUser = get().user;
      if (!currentUser) return;
      
      const updatedUser = { ...currentUser, ...updates };
      set({ user: updatedUser });
      
      try {
        storage.setItem(
          STORAGE_KEYS.AUTH,
          JSON.stringify({ isAuthenticated: true, user: updatedUser })
        );
      } catch (error) {
        console.error("Failed to persist user updates:", error);
      }
    },
  };
});

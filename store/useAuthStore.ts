// store/useAuthStore.ts
import { create } from "zustand";

export interface User {
  id: string;
  email: string;
  role?: string;
  name?: string;
}

interface AuthState {
  user: User | null;
  initialized: boolean;
  setUser: (user: User | null) => void;
  setInitialized: (v: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  initialized: false,
  setUser: (user) => set({ user }),
  setInitialized: (v) => set({ initialized: v }),
  logout: () => set({ user: null }),
}));

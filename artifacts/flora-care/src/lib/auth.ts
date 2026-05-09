import { create } from 'zustand';
import { setAuthTokenGetter } from '@workspace/api-client-react';

interface AuthState {
  token: string | null;
  setToken: (token: string | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem('floracare_token'),
  setToken: (token) => {
    if (token) {
      localStorage.setItem('floracare_token', token);
    } else {
      localStorage.removeItem('floracare_token');
    }
    set({ token });
  },
  logout: () => {
    localStorage.removeItem('floracare_token');
    set({ token: null });
  },
}));

setAuthTokenGetter(() => useAuthStore.getState().token);

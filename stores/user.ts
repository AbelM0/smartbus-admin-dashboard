import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import Cookies from 'js-cookie';
import { User } from '@/types/api/auth';

interface UserState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  setUser: (user: User, token: string, refreshToken: string) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      token: Cookies.get('accessToken') || null,
      refreshToken: Cookies.get('refreshToken') || null,
      setUser: (user, token, refreshToken) => {
        Cookies.set('accessToken', token, { expires: 7, secure: true, sameSite: 'strict' });
        Cookies.set('refreshToken', refreshToken, { expires: 30, secure: true, sameSite: 'strict' });
        set({ user, token, refreshToken });
      },
      logout: () => {
        Cookies.remove('accessToken');
        Cookies.remove('refreshToken');
        set({ user: null, token: null, refreshToken: null });
      },
    }),
    {
      name: 'smartbus-user',       // localStorage key
      partialize: (state) => ({ user: state.user }), // only persist user, not tokens (tokens live in cookies)
    }
  )
);

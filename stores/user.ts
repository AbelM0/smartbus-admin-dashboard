import { create } from 'zustand';
import Cookies from 'js-cookie';

interface UserState {
  user: any | null;
  token: string | null;
  refreshToken: string | null;
  setUser: (user: any, token: string, refreshToken: string) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>((set) => ({
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
}));

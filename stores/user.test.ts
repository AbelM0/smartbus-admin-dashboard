import { useUserStore } from './user';
import Cookies from 'js-cookie';

// Mock js-cookie to verify interactions without relying on JSDOM document cookies
jest.mock('js-cookie', () => ({
  get: jest.fn(),
  set: jest.fn(),
  remove: jest.fn(),
}));

describe('User Store (Zustand)', () => {
  beforeEach(() => {
    // Clear localStorage (used by zustand persist middleware)
    window.localStorage.clear();
    
    // Reset the store state manually
    useUserStore.setState({
      user: null,
      token: null,
      refreshToken: null,
    });

    jest.clearAllMocks();
  });

  it('should initialize with null user and tokens', () => {
    const state = useUserStore.getState();
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
    expect(state.refreshToken).toBeNull();
  });

  it('should update state and set secure cookies on setUser', () => {
    const mockUser = {
      id: 'user-1',
      fullName: 'Jane Doe',
      phone: '0911123456',
      role: 'ADMIN',
      status: 'ACTIVE',
      createdAt: '2023-01-01T00:00:00.000Z',
      updatedAt: '2023-01-01T00:00:00.000Z',
    };

    const mockAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mockAccessToken';
    const mockRefreshToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mockRefreshToken';

    // Call the setUser action
    useUserStore.getState().setUser(mockUser as any, mockAccessToken, mockRefreshToken);

    // Assert Zustand state is updated
    const state = useUserStore.getState();
    expect(state.user).toEqual(mockUser);
    expect(state.token).toBe(mockAccessToken);
    expect(state.refreshToken).toBe(mockRefreshToken);

    // Assert Cookies were set securely
    expect(Cookies.set).toHaveBeenCalledTimes(2);
    expect(Cookies.set).toHaveBeenCalledWith(
      'accessToken', 
      mockAccessToken, 
      expect.objectContaining({ secure: true, sameSite: 'strict', expires: 7 })
    );
    expect(Cookies.set).toHaveBeenCalledWith(
      'refreshToken', 
      mockRefreshToken, 
      expect.objectContaining({ secure: true, sameSite: 'strict', expires: 30 })
    );

    // Assert localStorage was updated via persist middleware
    const persistedState = JSON.parse(window.localStorage.getItem('smartbus-user') || '{}');
    expect(persistedState.state.user).toEqual(mockUser);
    // Persist middleware partialize configuration should only save user, not tokens
    expect(persistedState.state.token).toBeUndefined();
    expect(persistedState.state.refreshToken).toBeUndefined();
  });

  it('should clear state and remove cookies on logout', () => {
    const mockUser = { id: 'user-1', fullName: 'Jane Doe' };
    
    // Setup initial state
    useUserStore.setState({
      user: mockUser as any,
      token: 'mock-token',
      refreshToken: 'mock-refresh',
    });

    // Call logout
    useUserStore.getState().logout();

    // Assert state is cleared
    const state = useUserStore.getState();
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
    expect(state.refreshToken).toBeNull();

    // Assert cookies are removed
    expect(Cookies.remove).toHaveBeenCalledTimes(2);
    expect(Cookies.remove).toHaveBeenCalledWith('accessToken');
    expect(Cookies.remove).toHaveBeenCalledWith('refreshToken');

    // Assert localStorage is cleared for user
    const persistedState = JSON.parse(window.localStorage.getItem('smartbus-user') || '{}');
    expect(persistedState.state?.user).toBeNull();
  });
});

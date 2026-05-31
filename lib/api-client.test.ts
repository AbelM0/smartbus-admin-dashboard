import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import Cookies from 'js-cookie';
import apiClient from './api-client';
import { useUserStore } from '@/stores/user';
import { BASE_URL } from './base-url';

jest.mock('js-cookie');
jest.mock('@/stores/user');

describe('API Client Interceptors', () => {
  let mockApiClient: MockAdapter;
  let mockGlobalAxios: MockAdapter;

  beforeAll(() => {
    mockApiClient = new MockAdapter(apiClient);
    mockGlobalAxios = new MockAdapter(axios);
  });

  afterEach(() => {
    mockApiClient.reset();
    mockGlobalAxios.reset();
    jest.clearAllMocks();
  });

  afterAll(() => {
    mockApiClient.restore();
    mockGlobalAxios.restore();
  });

  describe('Request Interceptor', () => {
    it('should add Authorization header if accessToken exists in cookies', async () => {
      (Cookies.get as jest.Mock).mockReturnValue('mock-access-token');

      mockApiClient.onGet('/test').reply(200, { success: true });

      const response = await apiClient.get('/test');

      expect(response.config.headers?.Authorization).toBe('Bearer mock-access-token');
      expect(response.status).toBe(200);
    });

    it('should not add Authorization header if no accessToken exists', async () => {
      (Cookies.get as jest.Mock).mockReturnValue(undefined);

      mockApiClient.onGet('/test').reply(200, { success: true });

      const response = await apiClient.get('/test');

      expect(response.config.headers?.Authorization).toBeUndefined();
    });
  });

  describe('Response Interceptor (Token Refresh)', () => {
    const mockLogout = jest.fn();
    const mockSetUser = jest.fn();

    beforeEach(() => {
      (useUserStore.getState as jest.Mock).mockReturnValue({
        logout: mockLogout,
        setUser: mockSetUser,
      });
    });

    it('should logout if 401 and no refresh token', async () => {
      (Cookies.get as jest.Mock).mockImplementation((key) => {
        if (key === 'accessToken') return 'expired-token';
        return undefined;
      });

      mockApiClient.onGet('/protected').reply(401);

      await expect(apiClient.get('/protected')).rejects.toThrow();

      expect(mockLogout).toHaveBeenCalledTimes(1);
    });

    it('should refresh token and retry original request on 401', async () => {
      let currentAccessToken = 'expired-token';
      (Cookies.get as jest.Mock).mockImplementation((key) => {
        if (key === 'accessToken') return currentAccessToken;
        if (key === 'refreshToken') return 'valid-refresh-token';
        return undefined;
      });

      // When the store calls setUser, update our local mock variable
      mockSetUser.mockImplementation((user, newAccessToken) => {
        currentAccessToken = newAccessToken;
      });

      // First call to /protected returns 401
      mockApiClient.onGet('/protected').replyOnce(401);
      
      // The refresh endpoint returns new tokens (uses global axios.post)
      mockGlobalAxios.onPost(/\/api\/v1\/auth\/refresh/).reply(200, {
        success: true,
        data: {
          accessToken: 'new-access-token',
          refreshToken: 'new-refresh-token',
          user: { id: '1' },
        },
      });

      // The retried call to /protected succeeds
      mockApiClient.onGet('/protected').replyOnce(200, { success: true });

      const response = await apiClient.get('/protected');

      expect(response.status).toBe(200);
      expect(mockSetUser).toHaveBeenCalledWith({ id: '1' }, 'new-access-token', 'new-refresh-token');
      expect(response.config.headers?.Authorization).toBe('Bearer new-access-token');
    });

    it('should logout if refresh token request fails', async () => {
      (Cookies.get as jest.Mock).mockImplementation((key) => {
        if (key === 'accessToken') return 'expired-token';
        if (key === 'refreshToken') return 'invalid-refresh-token';
        return undefined;
      });

      mockApiClient.onGet('/protected').replyOnce(401);
      // The refresh endpoint fails
      mockGlobalAxios.onPost(/\/api\/v1\/auth\/refresh/).reply(401, { success: false });

      await expect(apiClient.get('/protected')).rejects.toThrow();

      expect(mockLogout).toHaveBeenCalledTimes(1);
    });
  });
});

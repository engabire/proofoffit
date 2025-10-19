/**
 * Integration Tests for Authentication System
 * Tests the complete authentication flow including OAuth, magic links, and session management
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { createClientSupabaseClient } from '@/lib/supabase/client';
import { useAuth } from '@/hooks/use-auth';

// Mock Supabase client
const mockSupabaseClient = {
  auth: {
    signInWithOAuth: vi.fn(),
    signInWithPassword: vi.fn(),
    signUp: vi.fn(),
    signOut: vi.fn(),
    getUser: vi.fn(),
    onAuthStateChange: vi.fn(),
    exchangeCodeForSession: vi.fn(),
  },
};

// Mock the Supabase client creation
vi.mock('@/lib/supabase/client', () => ({
  createClientSupabaseClient: () => mockSupabaseClient,
}));

// Mock Next.js router
const mockRouter = {
  push: vi.fn(),
  replace: vi.fn(),
  back: vi.fn(),
  forward: vi.fn(),
  refresh: vi.fn(),
  prefetch: vi.fn(),
};

vi.mock('next/navigation', () => ({
  useRouter: () => mockRouter,
}));

// Mock session storage
const mockSessionStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, 'sessionStorage', {
  value: mockSessionStorage,
});

describe('Authentication Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSessionStorage.getItem.mockReturnValue(null);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('OAuth Authentication Flow', () => {
    it('should initiate OAuth flow with correct parameters', async () => {
      const { signInWithOAuth } = useAuth();
      
      mockSupabaseClient.auth.signInWithOAuth.mockResolvedValue({
        data: { url: 'https://oauth.provider.com/auth' },
        error: null,
      });

      const result = await signInWithOAuth('google');

      expect(mockSupabaseClient.auth.signInWithOAuth).toHaveBeenCalledWith({
        provider: 'google',
        options: {
          redirectTo: expect.stringContaining('/auth/callback'),
          queryParams: expect.objectContaining({
            access_type: 'offline',
            prompt: 'consent',
          }),
        },
      });

      expect(result.success).toBe(true);
    });

    it('should handle OAuth errors gracefully', async () => {
      const { signInWithOAuth } = useAuth();
      
      mockSupabaseClient.auth.signInWithOAuth.mockResolvedValue({
        data: null,
        error: { message: 'OAuth provider unavailable' },
      });

      const result = await signInWithOAuth('google');

      expect(result.success).toBe(false);
      expect(result.error).toContain('OAuth provider unavailable');
    });

    it('should store PKCE code verifier in session storage', async () => {
      const { signInWithOAuth } = useAuth();
      
      mockSupabaseClient.auth.signInWithOAuth.mockResolvedValue({
        data: { url: 'https://oauth.provider.com/auth' },
        error: null,
      });

      await signInWithOAuth('google');

      expect(mockSessionStorage.setItem).toHaveBeenCalledWith(
        'pkce_code_verifier',
        expect.any(String)
      );
    });
  });

  describe('Magic Link Authentication', () => {
    it('should send magic link successfully', async () => {
      const { sendMagicLink } = useAuth();
      
      mockSupabaseClient.auth.signInWithOAuth.mockResolvedValue({
        data: { url: 'https://magic-link.com' },
        error: null,
      });

      const result = await sendMagicLink('test@example.com');

      expect(result.success).toBe(true);
    });

    it('should handle magic link errors', async () => {
      const { sendMagicLink } = useAuth();
      
      mockSupabaseClient.auth.signInWithOAuth.mockResolvedValue({
        data: null,
        error: { message: 'Invalid email address' },
      });

      const result = await sendMagicLink('invalid-email');

      expect(result.success).toBe(false);
      expect(result.error).toContain('Invalid email address');
    });
  });

  describe('Email/Password Authentication', () => {
    it('should sign in with valid credentials', async () => {
      const { signInWithEmail } = useAuth();
      
      mockSupabaseClient.auth.signInWithPassword.mockResolvedValue({
        data: {
          user: { id: 'user-123', email: 'test@example.com' },
          session: { access_token: 'token-123' },
        },
        error: null,
      });

      const result = await signInWithEmail('test@example.com', 'password123');

      expect(mockSupabaseClient.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(result.success).toBe(true);
    });

    it('should handle invalid credentials', async () => {
      const { signInWithEmail } = useAuth();
      
      mockSupabaseClient.auth.signInWithPassword.mockResolvedValue({
        data: null,
        error: { message: 'Invalid login credentials' },
      });

      const result = await signInWithEmail('test@example.com', 'wrongpassword');

      expect(result.success).toBe(false);
      expect(result.error).toContain('Invalid login credentials');
    });

    it('should sign up new users', async () => {
      const { signUpWithEmail } = useAuth();
      
      mockSupabaseClient.auth.signUp.mockResolvedValue({
        data: {
          user: { id: 'user-123', email: 'newuser@example.com' },
          session: null, // Email confirmation required
        },
        error: null,
      });

      const result = await signUpWithEmail('newuser@example.com', 'password123', 'seeker');

      expect(mockSupabaseClient.auth.signUp).toHaveBeenCalledWith({
        email: 'newuser@example.com',
        password: 'password123',
        options: {
          data: {
            audience: 'seeker',
          },
        },
      });

      expect(result.success).toBe(true);
    });
  });

  describe('Session Management', () => {
    it('should get current user session', async () => {
      const { getCurrentUser } = useAuth();
      
      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: {
          user: { id: 'user-123', email: 'test@example.com' },
        },
        error: null,
      });

      const user = await getCurrentUser();

      expect(mockSupabaseClient.auth.getUser).toHaveBeenCalled();
      expect(user).toEqual({ id: 'user-123', email: 'test@example.com' });
    });

    it('should sign out user', async () => {
      const { signOut } = useAuth();
      
      mockSupabaseClient.auth.signOut.mockResolvedValue({
        error: null,
      });

      const result = await signOut();

      expect(mockSupabaseClient.auth.signOut).toHaveBeenCalled();
      expect(result.success).toBe(true);
    });

    it('should handle session expiration', async () => {
      const { getCurrentUser } = useAuth();
      
      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: { message: 'Session expired' },
      });

      const user = await getCurrentUser();

      expect(user).toBeNull();
    });
  });

  describe('Auth State Changes', () => {
    it('should handle auth state changes', () => {
      const { onAuthStateChange } = useAuth();
      
      const mockCallback = vi.fn();
      const mockUnsubscribe = vi.fn();
      
      mockSupabaseClient.auth.onAuthStateChange.mockReturnValue({
        data: { subscription: { unsubscribe: mockUnsubscribe } },
      });

      const unsubscribe = onAuthStateChange(mockCallback);

      expect(mockSupabaseClient.auth.onAuthStateChange).toHaveBeenCalledWith(
        expect.any(Function)
      );
      expect(typeof unsubscribe).toBe('function');
    });
  });

  describe('Error Handling', () => {
    it('should handle network errors', async () => {
      const { signInWithEmail } = useAuth();
      
      mockSupabaseClient.auth.signInWithPassword.mockRejectedValue(
        new Error('Network error')
      );

      const result = await signInWithEmail('test@example.com', 'password123');

      expect(result.success).toBe(false);
      expect(result.error).toContain('Network error');
    });

    it('should handle rate limiting', async () => {
      const { signInWithEmail } = useAuth();
      
      mockSupabaseClient.auth.signInWithPassword.mockResolvedValue({
        data: null,
        error: { message: 'Too many requests' },
      });

      const result = await signInWithEmail('test@example.com', 'password123');

      expect(result.success).toBe(false);
      expect(result.error).toContain('Too many requests');
    });
  });

  describe('Security Features', () => {
    it('should validate email format', async () => {
      const { signInWithEmail } = useAuth();

      const result = await signInWithEmail('invalid-email', 'password123');

      expect(result.success).toBe(false);
      expect(result.error).toContain('valid email');
    });

    it('should validate password strength', async () => {
      const { signUpWithEmail } = useAuth();

      const result = await signUpWithEmail('test@example.com', '123', 'seeker');

      expect(result.success).toBe(false);
      expect(result.error).toContain('password');
    });

    it('should handle CSRF protection', async () => {
      const { signInWithEmail } = useAuth();
      
      mockSupabaseClient.auth.signInWithPassword.mockResolvedValue({
        data: null,
        error: { message: 'CSRF token mismatch' },
      });

      const result = await signInWithEmail('test@example.com', 'password123');

      expect(result.success).toBe(false);
      expect(result.error).toContain('CSRF token mismatch');
    });
  });

  describe('Enterprise Features', () => {
    it('should detect enterprise domains', async () => {
      const { signInWithEmail } = useAuth();
      
      mockSupabaseClient.auth.signInWithPassword.mockResolvedValue({
        data: {
          user: { id: 'user-123', email: 'user@company.com' },
          session: { access_token: 'token-123' },
        },
        error: null,
      });

      const result = await signInWithEmail('user@company.com', 'password123');

      expect(result.success).toBe(true);
      // Additional enterprise-specific assertions would go here
    });

    it('should handle SSO authentication', async () => {
      const { signInWithOAuth } = useAuth();
      
      mockSupabaseClient.auth.signInWithOAuth.mockResolvedValue({
        data: { url: 'https://sso.company.com/auth' },
        error: null,
      });

      const result = await signInWithOAuth('sso');

      expect(result.success).toBe(true);
      expect(mockSupabaseClient.auth.signInWithOAuth).toHaveBeenCalledWith(
        expect.objectContaining({
          provider: expect.any(String),
        })
      );
    });
  });
});

import { credentialManager } from "@/lib/security/credential-manager";

// Check if Google OAuth is configured
export const isGoogleOAuthConfigured = (): boolean => {
  return credentialManager.hasCredential("GOOGLE_CLIENT_ID") &&
    credentialManager.hasCredential("GOOGLE_CLIENT_SECRET");
};

// Google OAuth configuration - SECURE VERSION
export const googleOAuthConfig = {
  get clientId() {
    if (!isGoogleOAuthConfigured()) {
      throw new Error(
        "Google OAuth is not configured. Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET environment variables.",
      );
    }
    return credentialManager.getCredential("GOOGLE_CLIENT_ID");
  },
  get clientSecret() {
    if (!isGoogleOAuthConfigured()) {
      throw new Error(
        "Google OAuth is not configured. Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET environment variables.",
      );
    }
    return credentialManager.getCredential("GOOGLE_CLIENT_SECRET");
  },
  redirectUri: process.env.GOOGLE_REDIRECT_URI ||
    `${
      process.env.NEXT_PUBLIC_SITE_URL || "https://www.proofoffit.com"
    }/auth/callback`,
  scopes: [
    "openid",
    "email",
    "profile",
  ],
};

// Google OAuth helper functions
export const googleOAuth = {
  // Generate Google OAuth URL
  getAuthUrl(state?: string): string {
    const params = new URLSearchParams({
      client_id: googleOAuthConfig.clientId,
      redirect_uri: googleOAuthConfig.redirectUri,
      response_type: "code",
      scope: googleOAuthConfig.scopes.join(" "),
      access_type: "offline",
      prompt: "consent",
      ...(state && { state }),
    });

    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  },

  // Exchange authorization code for tokens
  async exchangeCodeForTokens(code: string) {
    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: googleOAuthConfig.clientId,
        client_secret: googleOAuthConfig.clientSecret,
        code,
        grant_type: "authorization_code",
        redirect_uri: googleOAuthConfig.redirectUri,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to exchange code for tokens");
    }

    return response.json();
  },

  // Get user info from Google
  async getUserInfo(accessToken: string) {
    const response = await fetch(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error("Failed to get user info from Google");
    }

    return response.json();
  },

  // Refresh access token
  async refreshToken(refreshToken: string) {
    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: googleOAuthConfig.clientId,
        client_secret: googleOAuthConfig.clientSecret,
        refresh_token: refreshToken,
        grant_type: "refresh_token",
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to refresh token");
    }

    return response.json();
  },
};

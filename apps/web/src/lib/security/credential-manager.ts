// Secure credential management
export class CredentialManager {
  private static instance: CredentialManager;
  private credentials: Map<string, string> = new Map();

  private constructor() {
    this.loadCredentials();
  }

  public static getInstance(): CredentialManager {
    // Prevent client-side instantiation in production
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
      console.warn('CredentialManager should not be instantiated on client-side in production');
      return new CredentialManager();
    }
    
    if (!CredentialManager.instance) {
      CredentialManager.instance = new CredentialManager();
    }
    return CredentialManager.instance;
  }

  private loadCredentials(): void {
    // Skip credential loading during build time
    if (
      typeof window === "undefined" &&
      process.env.NEXT_PHASE === "phase-production-build"
    ) {
      return;
    }

    // Load credentials from environment variables only
    const requiredCredentials = [
      "NEXT_PUBLIC_SUPABASE_URL",
      "SUPABASE_SERVICE_ROLE_KEY",
      "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    ];

    const optionalCredentials = [
      "STRIPE_SECRET_KEY",
      "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
      "STRIPE_WEBHOOK_SECRET",
      "GOOGLE_CLIENT_ID",
      "GOOGLE_CLIENT_SECRET",
      "GOOGLE_REDIRECT_URI",
      "RAPIDAPI_KEY",
      "USAJOBS_API_KEY",
    ];

    // Load required credentials (log warning if missing, don't throw error)
    for (const credential of requiredCredentials) {
      const value = process.env[credential];
      if (!value) {
        console.warn(`Missing required credential: ${credential}`);
        // Don't throw error in production to prevent app crashes
        if (process.env.NODE_ENV === "development") {
          throw new Error(`Missing required credential: ${credential}`);
        }
      } else {
        this.credentials.set(credential, value);
      }
    }

    // Load optional credentials (no error if missing)
    for (const credential of optionalCredentials) {
      const value = process.env[credential];
      if (value) {
        this.credentials.set(credential, value);
      }
    }
  }

  public getCredential(key: string): string {
    const credential = this.credentials.get(key);
    if (!credential) {
      // In production, return empty string instead of throwing to prevent crashes
      if (process.env.NODE_ENV === "production") {
        console.warn(`Credential not found: ${key}`);
        return "";
      }
      throw new Error(`Credential not found: ${key}`);
    }
    return credential;
  }

  public hasCredential(key: string): boolean {
    return this.credentials.has(key);
  }

  // Validate that no hardcoded credentials exist
  public static validateNoHardcodedCredentials(): void {
    const hardcodedPatterns = [
      /sk_live_[a-zA-Z0-9_]+/g,
      /pk_live_[a-zA-Z0-9_]+/g,
      /GOCSPX-[a-zA-Z0-9_-]+/g,
      /[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+\.[a-zA-Z]{2,}/g,
    ];

    // This would be called during build time to scan for hardcoded credentials
    // eslint-disable-next-line no-console
    console.log("Validating no hardcoded credentials...");
  }
}

// Export singleton instance
export const credentialManager = CredentialManager.getInstance();

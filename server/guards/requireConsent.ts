// Minimal server-side guard you can call before mutating actions (apply, save job, etc.)
// Replace TODO with a real DB check against consent_events for the current user.
export async function requireConsent(userId: string): Promise<void> {
    if (!userId) throw new Error("Unauthenticated");
    // TODO: query consent_events where user_id = $1 and event='policy_accept' and latest policy_version
    const hasConsent = true; // placeholder
    if (!hasConsent) {
        const err: any = new Error("Consent required");
        err.code = "CONSENT_REQUIRED";
        throw err;
    }
}


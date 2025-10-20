import crypto from "crypto";

export interface ConsentLedgerEntry {
    id: string;
    userId: string;
    packageId: string;
    consentId: string;
    action: "submitted" | "failed" | "skipped" | "duplicate";
    jobId: string | null;
    timestamp: Date;
    metadata: Record<string, any>;
    previousHash: string | null;
    hash: string;
}

export interface ConsentLedgerStats {
    totalEntries: number;
    entriesByAction: Record<string, number>;
    entriesByUser: Record<string, number>;
    entriesByPackage: Record<string, number>;
    recentActivity: ConsentLedgerEntry[];
    hashChainValid: boolean;
}

class ConsentLedger {
    private entries: ConsentLedgerEntry[] = [];
    private lastHash: string | null = null;

    /**
     * Create a new consent ledger entry with hash chaining
     */
    createEntry(data: {
        userId: string;
        packageId: string;
        consentId: string;
        action: "submitted" | "failed" | "skipped" | "duplicate";
        jobId?: string | null;
        metadata?: Record<string, any>;
    }): ConsentLedgerEntry {
        const id = crypto.randomUUID();
        const timestamp = new Date();

        // Create entry without hash first
        const entry: Omit<ConsentLedgerEntry, "hash"> = {
            id,
            userId: data.userId,
            packageId: data.packageId,
            consentId: data.consentId,
            action: data.action,
            jobId: data.jobId || null,
            timestamp,
            metadata: data.metadata || {},
            previousHash: this.lastHash,
        };

        // Calculate hash for this entry
        const hash = this.calculateHash(entry);
        const completeEntry: ConsentLedgerEntry = { ...entry, hash };

        // Add to entries (immutable - append only)
        this.entries.push(completeEntry);
        this.lastHash = hash;

        return completeEntry;
    }

    /**
     * Calculate SHA-256 hash for an entry
     */
    private calculateHash(entry: Omit<ConsentLedgerEntry, "hash">): string {
        const hashInput = JSON.stringify({
            id: entry.id,
            userId: entry.userId,
            packageId: entry.packageId,
            consentId: entry.consentId,
            action: entry.action,
            jobId: entry.jobId,
            timestamp: entry.timestamp.toISOString(),
            metadata: entry.metadata,
            previousHash: entry.previousHash,
        });

        return crypto.createHash("sha256").update(hashInput).digest("hex");
    }

    /**
     * Get consent ledger entries with optional filtering
     */
    getEntries(filters?: {
        userId?: string;
        packageId?: string;
        consentId?: string;
        action?: string;
        startDate?: Date;
        endDate?: Date;
        limit?: number;
    }): ConsentLedgerEntry[] {
        let filteredEntries = [...this.entries];

        if (filters) {
            if (filters.userId) {
                filteredEntries = filteredEntries.filter((entry) =>
                    entry.userId === filters.userId
                );
            }
            if (filters.packageId) {
                filteredEntries = filteredEntries.filter((entry) =>
                    entry.packageId === filters.packageId
                );
            }
            if (filters.consentId) {
                filteredEntries = filteredEntries.filter((entry) =>
                    entry.consentId === filters.consentId
                );
            }
            if (filters.action) {
                filteredEntries = filteredEntries.filter((entry) =>
                    entry.action === filters.action
                );
            }
            if (filters.startDate) {
                filteredEntries = filteredEntries.filter((entry) =>
                    entry.timestamp >= filters.startDate!
                );
            }
            if (filters.endDate) {
                filteredEntries = filteredEntries.filter((entry) =>
                    entry.timestamp <= filters.endDate!
                );
            }
        }

        // Sort by timestamp (newest first)
        filteredEntries.sort((a, b) =>
            b.timestamp.getTime() - a.timestamp.getTime()
        );

        if (filters?.limit) {
            filteredEntries = filteredEntries.slice(0, filters.limit);
        }

        return filteredEntries;
    }

    /**
     * Get consent ledger statistics
     */
    getStats(): ConsentLedgerStats {
        const entriesByAction: Record<string, number> = {};
        const entriesByUser: Record<string, number> = {};
        const entriesByPackage: Record<string, number> = {};

        this.entries.forEach((entry) => {
            entriesByAction[entry.action] =
                (entriesByAction[entry.action] || 0) + 1;
            entriesByUser[entry.userId] = (entriesByUser[entry.userId] || 0) +
                1;
            entriesByPackage[entry.packageId] =
                (entriesByPackage[entry.packageId] || 0) + 1;
        });

        const recentActivity = this.entries
            .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
            .slice(0, 10);

        return {
            totalEntries: this.entries.length,
            entriesByAction,
            entriesByUser,
            entriesByPackage,
            recentActivity,
            hashChainValid: this.verifyHashChain(),
        };
    }

    /**
     * Verify the integrity of the hash chain
     */
    verifyHashChain(): boolean {
        if (this.entries.length === 0) return true;

        for (let i = 0; i < this.entries.length; i++) {
            const entry = this.entries[i];

            // Verify hash calculation
            const expectedHash = this.calculateHash({
                id: entry.id,
                userId: entry.userId,
                packageId: entry.packageId,
                consentId: entry.consentId,
                action: entry.action,
                jobId: entry.jobId,
                timestamp: entry.timestamp,
                metadata: entry.metadata,
                previousHash: entry.previousHash,
            });

            if (entry.hash !== expectedHash) {
                console.error(
                    `Hash mismatch at entry ${i}: expected ${expectedHash}, got ${entry.hash}`,
                );
                return false;
            }

            // Verify previous hash link (except for first entry)
            if (i > 0) {
                const previousEntry = this.entries[i - 1];
                if (entry.previousHash !== previousEntry.hash) {
                    console.error(
                        `Previous hash mismatch at entry ${i}: expected ${previousEntry.hash}, got ${entry.previousHash}`,
                    );
                    return false;
                }
            } else {
                // First entry should have null previous hash
                if (entry.previousHash !== null) {
                    console.error(
                        `First entry should have null previous hash, got ${entry.previousHash}`,
                    );
                    return false;
                }
            }
        }

        return true;
    }

    /**
     * Get entries for a specific user's auto-apply activity
     */
    getUserAutoApplyActivity(userId: string, limit = 50): ConsentLedgerEntry[] {
        return this.getEntries({ userId, limit });
    }

    /**
     * Get entries for a specific package
     */
    getPackageActivity(packageId: string, limit = 100): ConsentLedgerEntry[] {
        return this.getEntries({ packageId, limit });
    }

    /**
     * Get entries for a specific consent
     */
    getConsentActivity(consentId: string): ConsentLedgerEntry[] {
        return this.getEntries({ consentId });
    }

    /**
     * Check if a job has already been applied to by a user
     */
    hasUserAppliedToJob(userId: string, jobId: string): boolean {
        return this.entries.some((entry) =>
            entry.userId === userId &&
            entry.jobId === jobId &&
            entry.action === "submitted"
        );
    }

    /**
     * Get application success rate for a user
     */
    getUserSuccessRate(
        userId: string,
    ): { submitted: number; failed: number; successRate: number } {
        const userEntries = this.getEntries({ userId });
        const submitted =
            userEntries.filter((entry) => entry.action === "submitted").length;
        const failed =
            userEntries.filter((entry) => entry.action === "failed").length;
        const total = submitted + failed;

        return {
            submitted,
            failed,
            successRate: total > 0 ? (submitted / total) * 100 : 0,
        };
    }

    /**
     * Clear all entries (for testing purposes)
     */
    clear(): void {
        this.entries = [];
        this.lastHash = null;
    }
}

// Singleton instance
export const consentLedger = new ConsentLedger();

// Action constants for type safety
export const CONSENT_ACTIONS = {
    SUBMITTED: "submitted",
    FAILED: "failed",
    SKIPPED: "skipped",
    DUPLICATE: "duplicate",
} as const;

export type ConsentAction =
    typeof CONSENT_ACTIONS[keyof typeof CONSENT_ACTIONS];

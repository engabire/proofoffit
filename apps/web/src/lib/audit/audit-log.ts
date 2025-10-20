import crypto from 'crypto';

export interface AuditLogEntry {
  id: string;
  timestamp: Date;
  userId: string | null;
  action: string;
  resource: string;
  resourceId: string | null;
  details: object | null;
  ipAddress: string | null;
  userAgent: string | null;
  previousHash: string | null;
  hash: string;
}

export interface AuditLogStats {
  totalEntries: number;
  entriesByAction: Record<string, number>;
  entriesByResource: Record<string, number>;
  entriesByUser: Record<string, number>;
  recentActivity: AuditLogEntry[];
  hashChainValid: boolean;
}

class AuditLogger {
  private logs: AuditLogEntry[] = [];
  private maxEntries = 10000;
  private lastHash: string | null = null;

  /**
   * Create a new audit log entry with hash chaining
   */
  createEntry(data: {
    userId?: string | null;
    action: string;
    resource: string;
    resourceId?: string | null;
    details?: object | null;
    ipAddress?: string | null;
    userAgent?: string | null;
  }): AuditLogEntry {
    const id = crypto.randomUUID();
    const timestamp = new Date();
    
    // Create entry without hash first
    const entry: Omit<AuditLogEntry, 'hash'> = {
      id,
      timestamp,
      userId: data.userId || null,
      action: data.action,
      resource: data.resource,
      resourceId: data.resourceId || null,
      details: data.details || null,
      ipAddress: data.ipAddress || null,
      userAgent: data.userAgent || null,
      previousHash: this.lastHash,
    };

    // Calculate hash for this entry
    const hash = this.calculateHash(entry);
    const completeEntry: AuditLogEntry = { ...entry, hash };

    // Add to logs
    this.logs.push(completeEntry);
    this.lastHash = hash;

    // Maintain max entries limit
    if (this.logs.length > this.maxEntries) {
      this.logs.shift();
    }

    return completeEntry;
  }

  /**
   * Calculate SHA-256 hash for an entry
   */
  private calculateHash(entry: Omit<AuditLogEntry, 'hash'>): string {
    const hashInput = JSON.stringify({
      id: entry.id,
      timestamp: entry.timestamp.toISOString(),
      userId: entry.userId,
      action: entry.action,
      resource: entry.resource,
      resourceId: entry.resourceId,
      details: entry.details,
      ipAddress: entry.ipAddress,
      userAgent: entry.userAgent,
      previousHash: entry.previousHash,
    });

    return crypto.createHash('sha256').update(hashInput).digest('hex');
  }

  /**
   * Get all audit logs with optional filtering
   */
  getLogs(filters?: {
    userId?: string;
    action?: string;
    resource?: string;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
  }): AuditLogEntry[] {
    let filteredLogs = [...this.logs];

    if (filters) {
      if (filters.userId) {
        filteredLogs = filteredLogs.filter(log => log.userId === filters.userId);
      }
      if (filters.action) {
        filteredLogs = filteredLogs.filter(log => log.action === filters.action);
      }
      if (filters.resource) {
        filteredLogs = filteredLogs.filter(log => log.resource === filters.resource);
      }
      if (filters.startDate) {
        filteredLogs = filteredLogs.filter(log => log.timestamp >= filters.startDate!);
      }
      if (filters.endDate) {
        filteredLogs = filteredLogs.filter(log => log.timestamp <= filters.endDate!);
      }
    }

    // Sort by timestamp (newest first)
    filteredLogs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    if (filters?.limit) {
      filteredLogs = filteredLogs.slice(0, filters.limit);
    }

    return filteredLogs;
  }

  /**
   * Get audit log statistics
   */
  getStats(): AuditLogStats {
    const entriesByAction: Record<string, number> = {};
    const entriesByResource: Record<string, number> = {};
    const entriesByUser: Record<string, number> = {};

    this.logs.forEach(log => {
      entriesByAction[log.action] = (entriesByAction[log.action] || 0) + 1;
      entriesByResource[log.resource] = (entriesByResource[log.resource] || 0) + 1;
      if (log.userId) {
        entriesByUser[log.userId] = (entriesByUser[log.userId] || 0) + 1;
      }
    });

    const recentActivity = this.logs
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, 10);

    return {
      totalEntries: this.logs.length,
      entriesByAction,
      entriesByResource,
      entriesByUser,
      recentActivity,
      hashChainValid: this.verifyHashChain(),
    };
  }

  /**
   * Verify the integrity of the hash chain
   */
  verifyHashChain(): boolean {
    if (this.logs.length === 0) return true;

    for (let i = 0; i < this.logs.length; i++) {
      const entry = this.logs[i];
      
      // Verify hash calculation
      const expectedHash = this.calculateHash({
        id: entry.id,
        timestamp: entry.timestamp,
        userId: entry.userId,
        action: entry.action,
        resource: entry.resource,
        resourceId: entry.resourceId,
        details: entry.details,
        ipAddress: entry.ipAddress,
        userAgent: entry.userAgent,
        previousHash: entry.previousHash,
      });

      if (entry.hash !== expectedHash) {
        console.error(`Hash mismatch at entry ${i}: expected ${expectedHash}, got ${entry.hash}`);
        return false;
      }

      // Verify previous hash link (except for first entry)
      if (i > 0) {
        const previousEntry = this.logs[i - 1];
        if (entry.previousHash !== previousEntry.hash) {
          console.error(`Previous hash mismatch at entry ${i}: expected ${previousEntry.hash}, got ${entry.previousHash}`);
          return false;
        }
      } else {
        // First entry should have null previous hash
        if (entry.previousHash !== null) {
          console.error(`First entry should have null previous hash, got ${entry.previousHash}`);
          return false;
        }
      }
    }

    return true;
  }

  /**
   * Clear all logs (for testing purposes)
   */
  clear(): void {
    this.logs = [];
    this.lastHash = null;
  }
}

// Singleton instance
export const auditLogger = new AuditLogger();

// Action constants for type safety
export const AUDIT_ACTIONS = {
  // Authentication
  USER_LOGIN: 'USER_LOGIN',
  USER_LOGOUT: 'USER_LOGOUT',
  USER_SIGNUP: 'USER_SIGNUP',
  
  // Profile Management
  PROFILE_CREATE: 'PROFILE_CREATE',
  PROFILE_UPDATE: 'PROFILE_UPDATE',
  PROFILE_DELETE: 'PROFILE_DELETE',
  
  // Proof/Evidence
  PROOF_CREATE: 'PROOF_CREATE',
  PROOF_UPDATE: 'PROOF_UPDATE',
  PROOF_DELETE: 'PROOF_DELETE',
  PROOF_LINK: 'PROOF_LINK',
  PROOF_UNLINK: 'PROOF_UNLINK',
  
  // Job Actions
  JOB_SAVE: 'JOB_SAVE',
  JOB_UNSAVE: 'JOB_UNSAVE',
  
  // Applications
  APPLICATION_CREATE: 'APPLICATION_CREATE',
  APPLICATION_UPDATE: 'APPLICATION_UPDATE',
  APPLICATION_WITHDRAW: 'APPLICATION_WITHDRAW',
  
  // Auto-Apply System
  PACKAGE_CREATE: 'PACKAGE_CREATE',
  CONSENT_CREATE: 'CONSENT_CREATE',
  CONSENT_REVOKE: 'CONSENT_REVOKE',
  AUTO_APPLY_RULE_CREATE: 'AUTO_APPLY_RULE_CREATE',
  AUTO_APPLY_RULE_UPDATE: 'AUTO_APPLY_RULE_UPDATE',
  AUTO_APPLY_RULE_DELETE: 'AUTO_APPLY_RULE_DELETE',
  
  // Subscriptions
  SUBSCRIPTION_CREATE: 'SUBSCRIPTION_CREATE',
  SUBSCRIPTION_CANCEL: 'SUBSCRIPTION_CANCEL',
  SUBSCRIPTION_UPDATE: 'SUBSCRIPTION_UPDATE',
  
  // Admin
  ADMIN_ACTION: 'ADMIN_ACTION',
  POLICY_VIOLATION: 'POLICY_VIOLATION',
} as const;

export type AuditAction = typeof AUDIT_ACTIONS[keyof typeof AUDIT_ACTIONS];

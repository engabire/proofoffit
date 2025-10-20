/**
 * Work Event Tracking System
 * 
 * Implements the reputation loop and reliability metrics from the ProofOfFit strategy.
 * Tracks work events to build trust and reliability scores.
 */

export type WorkEventType = 
  | 'SHIFT_CHECKIN'
  | 'SHIFT_CHECKOUT' 
  | 'CONTRACT_START'
  | 'CONTRACT_END'
  | 'FEEDBACK_SUBMITTED'
  | 'REHIRE'
  | 'TASK_COMPLETED'
  | 'PUNCTUALITY_VERIFIED'
  | 'PEER_ENDORSEMENT'
  | 'CERTIFICATION_EARNED';

export interface WorkEvent {
  id: string;
  candidate_id: string;
  employer_id?: string;
  job_id?: string;
  type: WorkEventType;
  source: 'self' | 'employer' | 'system' | 'peer';
  signature?: Buffer;
  prev_hash?: Buffer;
  payload: Record<string, any>;
  timestamp: Date;
}

export interface ReliabilityMetrics {
  punctuality_score: number; // 0-100
  task_completion_rate: number; // 0-100
  peer_endorsement_score: number; // 0-100
  rehire_rate: number; // 0-100
  overall_reliability: number; // 0-100
  data_points: number;
  last_updated: Date;
}

export class WorkEventTracker {
  private events: WorkEvent[] = [];
  private reliabilityCache: Map<string, ReliabilityMetrics> = new Map();

  /**
   * Record a work event
   */
  async recordEvent(event: Omit<WorkEvent, 'id' | 'timestamp'>): Promise<WorkEvent> {
    const workEvent: WorkEvent = {
      ...event,
      id: this.generateEventId(),
      timestamp: new Date(),
    };

    // TODO: In production, store in work_event table
    // INSERT INTO work_event (id, candidate_id, employer_id, job_id, type, source, payload, ts)
    // VALUES ($1, $2, $3, $4, $5, $6, $7, $8)

    this.events.push(workEvent);
    
    // Invalidate reliability cache for this candidate
    this.reliabilityCache.delete(event.candidate_id);
    
    return workEvent;
  }

  /**
   * Calculate reliability metrics for a candidate
   */
  async calculateReliability(candidateId: string): Promise<ReliabilityMetrics> {
    // Check cache first
    const cached = this.reliabilityCache.get(candidateId);
    if (cached) {
      return cached;
    }

    // TODO: In production, query work_event table
    // SELECT * FROM work_event WHERE candidate_id = $1 ORDER BY ts DESC

    const candidateEvents = this.events.filter(e => e.candidate_id === candidateId);
    
    if (candidateEvents.length === 0) {
      const defaultMetrics: ReliabilityMetrics = {
        punctuality_score: 50, // Neutral score for new candidates
        task_completion_rate: 50,
        peer_endorsement_score: 50,
        rehire_rate: 50,
        overall_reliability: 50,
        data_points: 0,
        last_updated: new Date(),
      };
      this.reliabilityCache.set(candidateId, defaultMetrics);
      return defaultMetrics;
    }

    // Calculate punctuality score
    const checkinEvents = candidateEvents.filter(e => e.type === 'SHIFT_CHECKIN');
    const checkoutEvents = candidateEvents.filter(e => e.type === 'SHIFT_CHECKOUT');
    const punctualityScore = this.calculatePunctualityScore(checkinEvents, checkoutEvents);

    // Calculate task completion rate
    const taskEvents = candidateEvents.filter(e => e.type === 'TASK_COMPLETED');
    const taskCompletionRate = this.calculateTaskCompletionRate(taskEvents, candidateEvents);

    // Calculate peer endorsement score
    const endorsementEvents = candidateEvents.filter(e => e.type === 'PEER_ENDORSEMENT');
    const peerEndorsementScore = this.calculatePeerEndorsementScore(endorsementEvents);

    // Calculate rehire rate
    const rehireEvents = candidateEvents.filter(e => e.type === 'REHIRE');
    const contractEndEvents = candidateEvents.filter(e => e.type === 'CONTRACT_END');
    const rehireRate = this.calculateRehireRate(rehireEvents, contractEndEvents);

    // Calculate overall reliability (weighted average)
    const overallReliability = Math.round(
      (punctualityScore * 0.3) +
      (taskCompletionRate * 0.3) +
      (peerEndorsementScore * 0.2) +
      (rehireRate * 0.2)
    );

    const metrics: ReliabilityMetrics = {
      punctuality_score: punctualityScore,
      task_completion_rate: taskCompletionRate,
      peer_endorsement_score: peerEndorsementScore,
      rehire_rate: rehireRate,
      overall_reliability: overallReliability,
      data_points: candidateEvents.length,
      last_updated: new Date(),
    };

    this.reliabilityCache.set(candidateId, metrics);
    return metrics;
  }

  /**
   * Get reliability score for FitScore calculation
   */
  async getReliabilityScore(candidateId: string): Promise<number> {
    const metrics = await this.calculateReliability(candidateId);
    return metrics.overall_reliability;
  }

  /**
   * Generate gamified reliability achievements
   */
  async getReliabilityAchievements(candidateId: string): Promise<string[]> {
    const metrics = await this.calculateReliability(candidateId);
    const achievements: string[] = [];

    if (metrics.punctuality_score >= 95) {
      achievements.push("Perfect Punctuality");
    }
    if (metrics.task_completion_rate >= 95) {
      achievements.push("Task Master");
    }
    if (metrics.rehire_rate >= 80) {
      achievements.push("Highly Rehirable");
    }
    if (metrics.data_points >= 100) {
      achievements.push("100 Days Verified");
    }
    if (metrics.overall_reliability >= 90) {
      achievements.push("Reliability Champion");
    }

    return achievements;
  }

  private calculatePunctualityScore(checkinEvents: WorkEvent[], checkoutEvents: WorkEvent[]): number {
    if (checkinEvents.length === 0) return 50;
    
    // Simple implementation - in production, would check against scheduled times
    const onTimeEvents = checkinEvents.filter(e => {
      const payload = e.payload as any;
      return payload?.on_time !== false;
    });
    
    return Math.round((onTimeEvents.length / checkinEvents.length) * 100);
  }

  private calculateTaskCompletionRate(taskEvents: WorkEvent[], allEvents: WorkEvent[]): number {
    if (allEvents.length === 0) return 50;
    
    const completedTasks = taskEvents.filter(e => {
      const payload = e.payload as any;
      return payload?.completed === true;
    });
    
    return Math.round((completedTasks.length / Math.max(taskEvents.length, 1)) * 100);
  }

  private calculatePeerEndorsementScore(endorsementEvents: WorkEvent[]): number {
    if (endorsementEvents.length === 0) return 50;
    
    const totalScore = endorsementEvents.reduce((sum, e) => {
      const payload = e.payload as any;
      return sum + (payload?.rating || 5);
    }, 0);
    
    return Math.round((totalScore / endorsementEvents.length) * 20); // Convert 1-5 scale to 0-100
  }

  private calculateRehireRate(rehireEvents: WorkEvent[], contractEndEvents: WorkEvent[]): number {
    if (contractEndEvents.length === 0) return 50;
    
    return Math.round((rehireEvents.length / contractEndEvents.length) * 100);
  }

  private generateEventId(): string {
    return `work_event_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }
}

// Singleton instance
export const workEventTracker = new WorkEventTracker();

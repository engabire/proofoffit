import { createClient } from "@supabase/supabase-js";

export interface JobApplication {
  id: string;
  jobId: string;
  userId: string;
  status:
    | "pending"
    | "submitted"
    | "reviewed"
    | "interview"
    | "rejected"
    | "accepted";
  appliedAt: Date;
  source: string;
  applicationData: {
    resumeUrl?: string;
    coverLetterUrl?: string;
    customAnswers?: Record<string, string>;
    documents?: string[];
  };
  trackingData: {
    lastChecked?: Date;
    statusUpdates?: Array<{
      status: string;
      timestamp: Date;
      source: string;
    }>;
  };
}

export interface AutoApplyConfig {
  userId: string;
  enabled: boolean;
  preferences: {
    jobTypes: string[];
    locations: string[];
    salaryMin?: number;
    salaryMax?: number;
    remoteOnly: boolean;
    keywords: string[];
    excludeKeywords: string[];
    maxApplicationsPerDay: number;
    maxApplicationsPerWeek: number;
  };
  resumeTemplate: {
    id: string;
    customizations: Record<string, any>;
  };
  coverLetterTemplate: {
    id: string;
    customizations: Record<string, any>;
  };
  notificationSettings: {
    email: boolean;
    inApp: boolean;
    dailySummary: boolean;
  };
}

export class ApplicationAutomation {
  private getSupabaseClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Supabase configuration missing");
    }

    return createClient(supabaseUrl, supabaseKey);
  }

  // Get user's auto-apply configuration
  async getAutoApplyConfig(userId: string): Promise<AutoApplyConfig | null> {
    try {
      const { data, error } = await this.getSupabaseClient()
        .from("auto_apply_configs")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (error && error.code !== "PGRST116") {
        throw error;
      }

      return data;
    } catch (error) {
      console.error("Error fetching auto-apply config:", error);
      return null;
    }
  }

  // Update user's auto-apply configuration
  async updateAutoApplyConfig(config: AutoApplyConfig): Promise<boolean> {
    try {
      const { error } = await this.getSupabaseClient()
        .from("auto_apply_configs")
        .upsert({
          user_id: config.userId,
          enabled: config.enabled,
          preferences: config.preferences,
          resume_template: config.resumeTemplate,
          cover_letter_template: config.coverLetterTemplate,
          notification_settings: config.notificationSettings,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      // Log the configuration update
      await this.getSupabaseClient()
        .from("action_log")
        .insert({
          action: "auto_apply_config_updated",
          objType: "auto_apply_config",
          objId: config.userId,
          payloadHash: `enabled_${config.enabled}`,
        });

      return true;
    } catch (error) {
      console.error("Error updating auto-apply config:", error);
      return false;
    }
  }

  // Check if a job matches user's auto-apply criteria
  async shouldAutoApply(job: any, config: AutoApplyConfig): Promise<boolean> {
    if (!config.enabled) return false;

    const { preferences } = config;

    // Check job type
    if (
      preferences.jobTypes.length > 0 &&
      !preferences.jobTypes.includes(job.type)
    ) {
      return false;
    }

    // Check location
    if (preferences.locations.length > 0) {
      const jobLocation = job.location.toLowerCase();
      const matchesLocation = preferences.locations.some((loc) =>
        jobLocation.includes(loc.toLowerCase())
      );
      if (!matchesLocation && !preferences.remoteOnly) {
        return false;
      }
    }

    // Check remote preference
    if (preferences.remoteOnly && !job.remote) {
      return false;
    }

    // Check salary range
    if (
      preferences.salaryMin && job.salary?.min &&
      job.salary.min < preferences.salaryMin
    ) {
      return false;
    }
    if (
      preferences.salaryMax && job.salary?.max &&
      job.salary.max > preferences.salaryMax
    ) {
      return false;
    }

    // Check keywords
    if (preferences.keywords.length > 0) {
      const jobText = `${job.title} ${job.description} ${
        job.requirements?.join(" ") || ""
      }`.toLowerCase();
      const hasRequiredKeywords = preferences.keywords.some((keyword) =>
        jobText.includes(keyword.toLowerCase())
      );
      if (!hasRequiredKeywords) {
        return false;
      }
    }

    // Check exclude keywords
    if (preferences.excludeKeywords.length > 0) {
      const jobText = `${job.title} ${job.description}`.toLowerCase();
      const hasExcludedKeywords = preferences.excludeKeywords.some((keyword) =>
        jobText.includes(keyword.toLowerCase())
      );
      if (hasExcludedKeywords) {
        return false;
      }
    }

    // Check application limits
    const today = new Date().toISOString().split("T")[0];
    const weekStart =
      new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split(
        "T",
      )[0];

    const { data: todayApplications } = await this.getSupabaseClient()
      .from("job_applications")
      .select("id")
      .eq("user_id", config.userId)
      .gte("applied_at", today);

    const { data: weekApplications } = await this.getSupabaseClient()
      .from("job_applications")
      .select("id")
      .eq("user_id", config.userId)
      .gte("applied_at", weekStart);

    if (
      todayApplications &&
      todayApplications.length >= preferences.maxApplicationsPerDay
    ) {
      return false;
    }

    if (
      weekApplications &&
      weekApplications.length >= preferences.maxApplicationsPerWeek
    ) {
      return false;
    }

    return true;
  }

  // Automatically apply to a job
  async autoApplyToJob(
    job: any,
    config: AutoApplyConfig,
  ): Promise<JobApplication | null> {
    try {
      // Generate tailored resume and cover letter
      const tailoredDocuments = await this.generateTailoredDocuments(
        job,
        config,
      );

      // Create application record
      const application: Omit<JobApplication, "id"> = {
        jobId: job.id,
        userId: config.userId,
        status: "submitted",
        appliedAt: new Date(),
        source: "auto_apply",
        applicationData: {
          resumeUrl: tailoredDocuments.resumeUrl,
          coverLetterUrl: tailoredDocuments.coverLetterUrl,
          customAnswers: tailoredDocuments.customAnswers,
          documents: tailoredDocuments.documents,
        },
        trackingData: {
          lastChecked: new Date(),
          statusUpdates: [{
            status: "submitted",
            timestamp: new Date(),
            source: "auto_apply",
          }],
        },
      };

      const { data, error } = await this.getSupabaseClient()
        .from("job_applications")
        .insert(application)
        .select()
        .single();

      if (error) throw error;

      // Log the application
      await this.getSupabaseClient()
        .from("action_log")
        .insert({
          action: "auto_apply_submitted",
          objType: "job_application",
          objId: data.id,
          payloadHash: `job_${job.id}`,
        });

      // Send notification if enabled
      if (
        config.notificationSettings.email || config.notificationSettings.inApp
      ) {
        await this.sendApplicationNotification(data, config);
      }

      return data;
    } catch (error) {
      console.error("Error auto-applying to job:", error);
      return null;
    }
  }

  // Generate tailored resume and cover letter
  private async generateTailoredDocuments(
    job: any,
    config: AutoApplyConfig,
  ): Promise<{
    resumeUrl: string;
    coverLetterUrl: string;
    customAnswers: Record<string, string>;
    documents: string[];
  }> {
    // This would integrate with your AI tailoring system
    // For now, return placeholder URLs
    return {
      resumeUrl:
        `/api/documents/generate-resume?jobId=${job.id}&userId=${config.userId}`,
      coverLetterUrl:
        `/api/documents/generate-cover-letter?jobId=${job.id}&userId=${config.userId}`,
      customAnswers: {},
      documents: [],
    };
  }

  // Send application notification
  private async sendApplicationNotification(
    application: JobApplication,
    config: AutoApplyConfig,
  ): Promise<void> {
    try {
      const notification = {
        user_id: config.userId,
        type: "application_submitted",
        title: "Application Submitted",
        message: `Successfully applied to ${application.jobId}`,
        data: {
          applicationId: application.id,
          jobId: application.jobId,
        },
        read: false,
        created_at: new Date().toISOString(),
      };

      await this.getSupabaseClient()
        .from("notifications")
        .insert(notification);

      // Send email if enabled
      if (config.notificationSettings.email) {
        // This would integrate with your email system
        console.log(
          "Sending email notification for application:",
          application.id,
        );
      }
    } catch (error) {
      console.error("Error sending application notification:", error);
    }
  }

  // Get user's application history
  async getApplicationHistory(
    userId: string,
    limit: number = 50,
  ): Promise<JobApplication[]> {
    try {
      const { data, error } = await this.getSupabaseClient()
        .from("job_applications")
        .select("*")
        .eq("user_id", userId)
        .order("applied_at", { ascending: false })
        .limit(limit);

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error("Error fetching application history:", error);
      return [];
    }
  }

  // Update application status
  async updateApplicationStatus(
    applicationId: string,
    status: string,
    source: string = "manual",
  ): Promise<boolean> {
    try {
      const { error } = await this.getSupabaseClient()
        .from("job_applications")
        .update({
          status,
          tracking_data: {
            last_checked: new Date().toISOString(),
            status_updates: [
              {
                status,
                timestamp: new Date().toISOString(),
                source,
              },
            ],
          },
          updated_at: new Date().toISOString(),
        })
        .eq("id", applicationId);

      if (error) throw error;

      return true;
    } catch (error) {
      console.error("Error updating application status:", error);
      return false;
    }
  }

  // Get application statistics
  async getApplicationStats(userId: string): Promise<{
    total: number;
    pending: number;
    submitted: number;
    reviewed: number;
    interview: number;
    rejected: number;
    accepted: number;
    thisWeek: number;
    thisMonth: number;
  }> {
    try {
      const { data, error } = await this.getSupabaseClient()
        .from("job_applications")
        .select("status, applied_at")
        .eq("user_id", userId);

      if (error) throw error;

      const now = new Date();
      const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

      const stats = {
        total: data.length,
        pending: 0,
        submitted: 0,
        reviewed: 0,
        interview: 0,
        rejected: 0,
        accepted: 0,
        thisWeek: 0,
        thisMonth: 0,
      };

      const applications = (data ?? []) as Array<
        { status: string; applied_at: string | Date }
      >;

      applications.forEach((app) => {
        const statusKey = app.status as keyof typeof stats;
        if (statusKey in stats) {
          stats[statusKey]++;
        }

        const appliedAt = new Date(app.applied_at as any);
        if (appliedAt >= weekStart) stats.thisWeek++;
        if (appliedAt >= monthStart) stats.thisMonth++;
      });

      return stats;
    } catch (error) {
      console.error("Error fetching application stats:", error);
      return {
        total: 0,
        pending: 0,
        submitted: 0,
        reviewed: 0,
        interview: 0,
        rejected: 0,
        accepted: 0,
        thisWeek: 0,
        thisMonth: 0,
      };
    }
  }
}

// Export singleton instance
export const applicationAutomation = new ApplicationAutomation();

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// ATS (Applicant Tracking System) integration APIs
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { provider, action, data } = body;

        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!,
        );

        switch (provider) {
            case "greenhouse":
                return await handleGreenhouseIntegration(
                    action,
                    data,
                    supabase,
                );
            case "lever":
                return await handleLeverIntegration(action, data, supabase);
            case "workday":
                return await handleWorkdayIntegration(action, data, supabase);
            case "bamboohr":
                return await handleBambooHRIntegration(action, data, supabase);
            case "jobvite":
                return await handleJobviteIntegration(action, data, supabase);
            case "icims":
                return await handleICIMSIntegration(action, data, supabase);
            default:
                return NextResponse.json(
                    { error: "Unsupported ATS provider" },
                    { status: 400 },
                );
        }
    } catch (error) {
        console.error("ATS integration error:", error);
        return NextResponse.json(
            { error: "ATS integration failed" },
            { status: 500 },
        );
    }
}

async function handleGreenhouseIntegration(
    action: string,
    data: any,
    supabase: any,
) {
    const greenhouseApiKey = process.env.GREENHOUSE_API_KEY;
    if (!greenhouseApiKey) {
        return NextResponse.json(
            { error: "Greenhouse API key not configured" },
            { status: 500 },
        );
    }

    switch (action) {
        case "sync_jobs":
            return await syncGreenhouseJobs(data, greenhouseApiKey, supabase);
        case "create_application":
            return await createGreenhouseApplication(
                data,
                greenhouseApiKey,
                supabase,
            );
        case "get_candidate":
            return await getGreenhouseCandidate(
                data,
                greenhouseApiKey,
                supabase,
            );
        case "update_application_status":
            return await updateGreenhouseApplicationStatus(
                data,
                greenhouseApiKey,
                supabase,
            );
        case "webhook":
            return await handleGreenhouseWebhook(data, supabase);
        default:
            return NextResponse.json(
                { error: "Unsupported Greenhouse action" },
                { status: 400 },
            );
    }
}

async function syncGreenhouseJobs(data: any, apiKey: string, supabase: any) {
    try {
        const response = await fetch("https://harvest.greenhouse.io/v1/jobs", {
            headers: {
                "Authorization": `Basic ${
                    Buffer.from(`${apiKey}:`).toString("base64")
                }`,
                "Content-Type": "application/json",
            },
        });

        const jobs = await response.json();

        if (!response.ok) {
            throw new Error(
                jobs.message || "Failed to fetch jobs from Greenhouse",
            );
        }

        // Process and store jobs
        const processedJobs = jobs.map((job: any) => ({
            external_id: job.id.toString(),
            source: "greenhouse",
            title: job.name,
            company: job.company?.name || "Unknown",
            location: job.offices?.[0]?.name || "Unknown",
            description: job.content,
            requirements: job.requirements,
            benefits: job.benefits,
            status: job.status?.name || "active",
            created_at: job.created_at,
            updated_at: job.updated_at,
            metadata: job,
        }));

        // Upsert jobs to database
        for (const job of processedJobs) {
            await supabase
                .from("jobs")
                .upsert(job, { onConflict: "external_id,source" });
        }

        // Log sync operation
        await supabase
            .from("ats_sync_logs")
            .insert({
                provider: "greenhouse",
                action: "sync_jobs",
                records_processed: processedJobs.length,
                status: "success",
                created_at: new Date().toISOString(),
            });

        return NextResponse.json({
            success: true,
            data: {
                message: `Synced ${processedJobs.length} jobs from Greenhouse`,
                count: processedJobs.length,
            },
        });
    } catch (error) {
        console.error("Greenhouse job sync error:", error);
        return NextResponse.json(
            { error: "Failed to sync Greenhouse jobs" },
            { status: 500 },
        );
    }
}

async function createGreenhouseApplication(
    data: any,
    apiKey: string,
    supabase: any,
) {
    try {
        const response = await fetch(
            `https://harvest.greenhouse.io/v1/applications`,
            {
                method: "POST",
                headers: {
                    "Authorization": `Basic ${
                        Buffer.from(`${apiKey}:`).toString("base64")
                    }`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    job_id: data.jobId,
                    candidate: {
                        first_name: data.candidate.firstName,
                        last_name: data.candidate.lastName,
                        email: data.candidate.email,
                        phone: data.candidate.phone,
                        resume: data.candidate.resumeUrl,
                        cover_letter: data.candidate.coverLetterUrl,
                    },
                    source: "proofoffit",
                    referred_by: data.referredBy,
                }),
            },
        );

        const application = await response.json();

        if (!response.ok) {
            throw new Error(
                application.message ||
                    "Failed to create application in Greenhouse",
            );
        }

        // Store application in our database
        await supabase
            .from("ats_applications")
            .insert({
                user_id: data.userId,
                provider: "greenhouse",
                external_application_id: application.id.toString(),
                external_job_id: data.jobId,
                candidate_email: data.candidate.email,
                status: "submitted",
                metadata: application,
                created_at: new Date().toISOString(),
            });

        return NextResponse.json({
            success: true,
            data: application,
        });
    } catch (error) {
        console.error("Greenhouse application creation error:", error);
        return NextResponse.json(
            { error: "Failed to create Greenhouse application" },
            { status: 500 },
        );
    }
}

async function getGreenhouseCandidate(
    data: any,
    apiKey: string,
    supabase: any,
) {
    try {
        const response = await fetch(
            `https://harvest.greenhouse.io/v1/candidates/${data.candidateId}`,
            {
                headers: {
                    "Authorization": `Basic ${
                        Buffer.from(`${apiKey}:`).toString("base64")
                    }`,
                    "Content-Type": "application/json",
                },
            },
        );

        const candidate = await response.json();

        if (!response.ok) {
            throw new Error(
                candidate.message ||
                    "Failed to fetch candidate from Greenhouse",
            );
        }

        return NextResponse.json({
            success: true,
            data: candidate,
        });
    } catch (error) {
        console.error("Greenhouse candidate fetch error:", error);
        return NextResponse.json(
            { error: "Failed to fetch Greenhouse candidate" },
            { status: 500 },
        );
    }
}

async function updateGreenhouseApplicationStatus(
    data: any,
    apiKey: string,
    supabase: any,
) {
    try {
        const response = await fetch(
            `https://harvest.greenhouse.io/v1/applications/${data.applicationId}`,
            {
                method: "PATCH",
                headers: {
                    "Authorization": `Basic ${
                        Buffer.from(`${apiKey}:`).toString("base64")
                    }`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    status: data.status,
                    notes: data.notes,
                }),
            },
        );

        const application = await response.json();

        if (!response.ok) {
            throw new Error(
                application.message ||
                    "Failed to update application status in Greenhouse",
            );
        }

        // Update application in our database
        await supabase
            .from("ats_applications")
            .update({
                status: data.status,
                notes: data.notes,
                updated_at: new Date().toISOString(),
            })
            .eq("external_application_id", data.applicationId)
            .eq("provider", "greenhouse");

        return NextResponse.json({
            success: true,
            data: application,
        });
    } catch (error) {
        console.error("Greenhouse application status update error:", error);
        return NextResponse.json(
            { error: "Failed to update Greenhouse application status" },
            { status: 500 },
        );
    }
}

async function handleGreenhouseWebhook(data: any, supabase: any) {
    // Handle Greenhouse webhook events
    await supabase
        .from("ats_webhook_events")
        .insert({
            provider: "greenhouse",
            event_type: data.event_type,
            external_id: data.payload?.id,
            status: "received",
            metadata: data,
            created_at: new Date().toISOString(),
        });

    return NextResponse.json({ success: true });
}

async function handleLeverIntegration(
    action: string,
    data: any,
    supabase: any,
) {
    const leverApiKey = process.env.LEVER_API_KEY;
    if (!leverApiKey) {
        return NextResponse.json(
            { error: "Lever API key not configured" },
            { status: 500 },
        );
    }

    switch (action) {
        case "sync_jobs":
            return await syncLeverJobs(data, leverApiKey, supabase);
        case "create_application":
            return await createLeverApplication(data, leverApiKey, supabase);
        case "webhook":
            return await handleLeverWebhook(data, supabase);
        default:
            return NextResponse.json(
                { error: "Unsupported Lever action" },
                { status: 400 },
            );
    }
}

async function syncLeverJobs(data: any, apiKey: string, supabase: any) {
    try {
        const response = await fetch("https://api.lever.co/v1/postings", {
            headers: {
                "Authorization": `Basic ${
                    Buffer.from(`${apiKey}:`).toString("base64")
                }`,
                "Content-Type": "application/json",
            },
        });

        const jobs = await response.json();

        if (!response.ok) {
            throw new Error(jobs.message || "Failed to fetch jobs from Lever");
        }

        // Process and store jobs
        const processedJobs = jobs.data.map((job: any) => ({
            external_id: job.id,
            source: "lever",
            title: job.text,
            company: job.categories?.team || "Unknown",
            location: job.categories?.location || "Unknown",
            description: job.description,
            requirements: job.requirements,
            benefits: job.benefits,
            status: job.state === "published" ? "active" : "inactive",
            created_at: job.createdAt,
            updated_at: job.updatedAt,
            metadata: job,
        }));

        // Upsert jobs to database
        for (const job of processedJobs) {
            await supabase
                .from("jobs")
                .upsert(job, { onConflict: "external_id,source" });
        }

        // Log sync operation
        await supabase
            .from("ats_sync_logs")
            .insert({
                provider: "lever",
                action: "sync_jobs",
                records_processed: processedJobs.length,
                status: "success",
                created_at: new Date().toISOString(),
            });

        return NextResponse.json({
            success: true,
            data: {
                message: `Synced ${processedJobs.length} jobs from Lever`,
                count: processedJobs.length,
            },
        });
    } catch (error) {
        console.error("Lever job sync error:", error);
        return NextResponse.json(
            { error: "Failed to sync Lever jobs" },
            { status: 500 },
        );
    }
}

async function createLeverApplication(
    data: any,
    apiKey: string,
    supabase: any,
) {
    try {
        const response = await fetch(
            `https://api.lever.co/v1/postings/${data.postingId}/referrals`,
            {
                method: "POST",
                headers: {
                    "Authorization": `Basic ${
                        Buffer.from(`${apiKey}:`).toString("base64")
                    }`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name:
                        `${data.candidate.firstName} ${data.candidate.lastName}`,
                    email: data.candidate.email,
                    phone: data.candidate.phone,
                    resume: data.candidate.resumeUrl,
                    cover_letter: data.candidate.coverLetterUrl,
                    source: "proofoffit",
                }),
            },
        );

        const application = await response.json();

        if (!response.ok) {
            throw new Error(
                application.message || "Failed to create application in Lever",
            );
        }

        // Store application in our database
        await supabase
            .from("ats_applications")
            .insert({
                user_id: data.userId,
                provider: "lever",
                external_application_id: application.id,
                external_job_id: data.postingId,
                candidate_email: data.candidate.email,
                status: "submitted",
                metadata: application,
                created_at: new Date().toISOString(),
            });

        return NextResponse.json({
            success: true,
            data: application,
        });
    } catch (error) {
        console.error("Lever application creation error:", error);
        return NextResponse.json(
            { error: "Failed to create Lever application" },
            { status: 500 },
        );
    }
}

async function handleLeverWebhook(data: any, supabase: any) {
    // Handle Lever webhook events
    await supabase
        .from("ats_webhook_events")
        .insert({
            provider: "lever",
            event_type: data.event_type,
            external_id: data.payload?.id,
            status: "received",
            metadata: data,
            created_at: new Date().toISOString(),
        });

    return NextResponse.json({ success: true });
}

async function handleWorkdayIntegration(
    action: string,
    data: any,
    supabase: any,
) {
    // Workday integration (typically uses SOAP/XML APIs)
    return NextResponse.json({
        success: true,
        data: { message: "Workday integration coming soon" },
    });
}

async function handleBambooHRIntegration(
    action: string,
    data: any,
    supabase: any,
) {
    const bambooApiKey = process.env.BAMBOOHR_API_KEY;
    const bambooSubdomain = process.env.BAMBOOHR_SUBDOMAIN;

    if (!bambooApiKey || !bambooSubdomain) {
        return NextResponse.json(
            { error: "BambooHR configuration missing" },
            { status: 500 },
        );
    }

    switch (action) {
        case "sync_jobs":
            return await syncBambooHRJobs(
                data,
                bambooApiKey,
                bambooSubdomain,
                supabase,
            );
        case "create_application":
            return await createBambooHRApplication(
                data,
                bambooApiKey,
                bambooSubdomain,
                supabase,
            );
        case "webhook":
            return await handleBambooHRWebhook(data, supabase);
        default:
            return NextResponse.json(
                { error: "Unsupported BambooHR action" },
                { status: 400 },
            );
    }
}

async function syncBambooHRJobs(
    data: any,
    apiKey: string,
    subdomain: string,
    supabase: any,
) {
    try {
        const response = await fetch(
            `https://api.bamboohr.com/api/gateway.php/${subdomain}/v1/jobs`,
            {
                headers: {
                    "Authorization": `Basic ${
                        Buffer.from(`${apiKey}:x`).toString("base64")
                    }`,
                    "Content-Type": "application/json",
                },
            },
        );

        const jobs = await response.json();

        if (!response.ok) {
            throw new Error(
                jobs.message || "Failed to fetch jobs from BambooHR",
            );
        }

        // Process and store jobs
        const processedJobs = jobs.map((job: any) => ({
            external_id: job.id.toString(),
            source: "bamboohr",
            title: job.title,
            company: job.company || "Unknown",
            location: job.location || "Unknown",
            description: job.description,
            requirements: job.requirements,
            benefits: job.benefits,
            status: job.status === "active" ? "active" : "inactive",
            created_at: job.createdAt,
            updated_at: job.updatedAt,
            metadata: job,
        }));

        // Upsert jobs to database
        for (const job of processedJobs) {
            await supabase
                .from("jobs")
                .upsert(job, { onConflict: "external_id,source" });
        }

        // Log sync operation
        await supabase
            .from("ats_sync_logs")
            .insert({
                provider: "bamboohr",
                action: "sync_jobs",
                records_processed: processedJobs.length,
                status: "success",
                created_at: new Date().toISOString(),
            });

        return NextResponse.json({
            success: true,
            data: {
                message: `Synced ${processedJobs.length} jobs from BambooHR`,
                count: processedJobs.length,
            },
        });
    } catch (error) {
        console.error("BambooHR job sync error:", error);
        return NextResponse.json(
            { error: "Failed to sync BambooHR jobs" },
            { status: 500 },
        );
    }
}

async function createBambooHRApplication(
    data: any,
    apiKey: string,
    subdomain: string,
    supabase: any,
) {
    try {
        const response = await fetch(
            `https://api.bamboohr.com/api/gateway.php/${subdomain}/v1/applications`,
            {
                method: "POST",
                headers: {
                    "Authorization": `Basic ${
                        Buffer.from(`${apiKey}:x`).toString("base64")
                    }`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    jobId: data.jobId,
                    firstName: data.candidate.firstName,
                    lastName: data.candidate.lastName,
                    email: data.candidate.email,
                    phone: data.candidate.phone,
                    resume: data.candidate.resumeUrl,
                    coverLetter: data.candidate.coverLetterUrl,
                    source: "proofoffit",
                }),
            },
        );

        const application = await response.json();

        if (!response.ok) {
            throw new Error(
                application.message ||
                    "Failed to create application in BambooHR",
            );
        }

        // Store application in our database
        await supabase
            .from("ats_applications")
            .insert({
                user_id: data.userId,
                provider: "bamboohr",
                external_application_id: application.id.toString(),
                external_job_id: data.jobId,
                candidate_email: data.candidate.email,
                status: "submitted",
                metadata: application,
                created_at: new Date().toISOString(),
            });

        return NextResponse.json({
            success: true,
            data: application,
        });
    } catch (error) {
        console.error("BambooHR application creation error:", error);
        return NextResponse.json(
            { error: "Failed to create BambooHR application" },
            { status: 500 },
        );
    }
}

async function handleBambooHRWebhook(data: any, supabase: any) {
    // Handle BambooHR webhook events
    await supabase
        .from("ats_webhook_events")
        .insert({
            provider: "bamboohr",
            event_type: data.event_type,
            external_id: data.payload?.id,
            status: "received",
            metadata: data,
            created_at: new Date().toISOString(),
        });

    return NextResponse.json({ success: true });
}

async function handleJobviteIntegration(
    action: string,
    data: any,
    supabase: any,
) {
    // Jobvite integration
    return NextResponse.json({
        success: true,
        data: { message: "Jobvite integration coming soon" },
    });
}

async function handleICIMSIntegration(
    action: string,
    data: any,
    supabase: any,
) {
    // iCIMS integration
    return NextResponse.json({
        success: true,
        data: { message: "iCIMS integration coming soon" },
    });
}

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const provider = searchParams.get("provider");
    const userId = searchParams.get("userId");

    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
    );

    try {
        if (provider && userId) {
            // Get user's ATS applications for specific provider
            const { data: applications, error } = await supabase
                .from("ats_applications")
                .select("*")
                .eq("user_id", userId)
                .eq("provider", provider)
                .order("created_at", { ascending: false });

            if (error) throw error;

            return NextResponse.json({
                success: true,
                data: applications,
            });
        } else if (userId) {
            // Get all ATS applications for user
            const { data: applications, error } = await supabase
                .from("ats_applications")
                .select("*")
                .eq("user_id", userId)
                .order("created_at", { ascending: false });

            if (error) throw error;

            return NextResponse.json({
                success: true,
                data: applications,
            });
        } else if (provider) {
            // Get sync logs for specific provider
            const { data: logs, error } = await supabase
                .from("ats_sync_logs")
                .select("*")
                .eq("provider", provider)
                .order("created_at", { ascending: false })
                .limit(50);

            if (error) throw error;

            return NextResponse.json({
                success: true,
                data: logs,
            });
        } else {
            // Get all sync logs
            const { data: logs, error } = await supabase
                .from("ats_sync_logs")
                .select("*")
                .order("created_at", { ascending: false })
                .limit(50);

            if (error) throw error;

            return NextResponse.json({
                success: true,
                data: logs,
            });
        }
    } catch (error) {
        console.error("ATS data fetch error:", error);
        return NextResponse.json(
            { error: "Failed to fetch ATS data" },
            { status: 500 },
        );
    }
}


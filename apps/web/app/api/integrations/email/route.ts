import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Email service integrations (Resend, SendGrid, Mailgun, etc.)
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { provider, action, data } = body;

        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!,
        );

        switch (provider) {
            case "resend":
                return await handleResendIntegration(action, data, supabase);
            case "sendgrid":
                return await handleSendGridIntegration(action, data, supabase);
            case "mailgun":
                return await handleMailgunIntegration(action, data, supabase);
            default:
                return NextResponse.json(
                    { error: "Unsupported email provider" },
                    { status: 400 },
                );
        }
    } catch (error) {
        console.error("Email integration error:", error);
        return NextResponse.json(
            { error: "Email integration failed" },
            { status: 500 },
        );
    }
}

async function handleResendIntegration(
    action: string,
    data: any,
    supabase: any,
) {
    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
        return NextResponse.json(
            { error: "Resend API key not configured" },
            { status: 500 },
        );
    }

    switch (action) {
        case "send":
            return await sendResendEmail(data, resendApiKey, supabase);
        case "verify":
            return await verifyResendDomain(data, resendApiKey, supabase);
        case "webhook":
            return await handleResendWebhook(data, supabase);
        default:
            return NextResponse.json(
                { error: "Unsupported Resend action" },
                { status: 400 },
            );
    }
}

async function sendResendEmail(data: any, apiKey: string, supabase: any) {
    try {
        const response = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                from: data.from || "ProofOfFit <noreply@proofoffit.com>",
                to: data.to,
                subject: data.subject,
                html: data.html,
                text: data.text,
                tags: data.tags || [],
            }),
        });

        const result = await response.json();

        if (response.ok) {
            // Log successful email send
            await supabase
                .from("email_logs")
                .insert({
                    provider: "resend",
                    action: "send",
                    recipient: data.to,
                    subject: data.subject,
                    status: "sent",
                    external_id: result.id,
                    metadata: result,
                    created_at: new Date().toISOString(),
                });

            return NextResponse.json({
                success: true,
                data: result,
            });
        } else {
            throw new Error(result.message || "Failed to send email");
        }
    } catch (error) {
        console.error("Resend email error:", error);
        return NextResponse.json(
            { error: "Failed to send email via Resend" },
            { status: 500 },
        );
    }
}

async function verifyResendDomain(data: any, apiKey: string, supabase: any) {
    try {
        const response = await fetch("https://api.resend.com/domains", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: data.domain,
            }),
        });

        const result = await response.json();

        if (response.ok) {
            // Log domain verification
            await supabase
                .from("email_domains")
                .insert({
                    provider: "resend",
                    domain: data.domain,
                    status: "pending",
                    external_id: result.id,
                    verification_records: result.records,
                    created_at: new Date().toISOString(),
                });

            return NextResponse.json({
                success: true,
                data: result,
            });
        } else {
            throw new Error(result.message || "Failed to verify domain");
        }
    } catch (error) {
        console.error("Resend domain verification error:", error);
        return NextResponse.json(
            { error: "Failed to verify domain via Resend" },
            { status: 500 },
        );
    }
}

async function handleResendWebhook(data: any, supabase: any) {
    // Handle Resend webhook events (delivery, bounce, complaint, etc.)
    await supabase
        .from("email_events")
        .insert({
            provider: "resend",
            event_type: data.type,
            email_id: data.data?.email_id,
            recipient: data.data?.to,
            status: data.type,
            metadata: data,
            created_at: new Date().toISOString(),
        });

    return NextResponse.json({ success: true });
}

async function handleSendGridIntegration(
    action: string,
    data: any,
    supabase: any,
) {
    const sendGridApiKey = process.env.SENDGRID_API_KEY;
    if (!sendGridApiKey) {
        return NextResponse.json(
            { error: "SendGrid API key not configured" },
            { status: 500 },
        );
    }

    switch (action) {
        case "send":
            return await sendSendGridEmail(data, sendGridApiKey, supabase);
        case "template":
            return await createSendGridTemplate(data, sendGridApiKey, supabase);
        case "webhook":
            return await handleSendGridWebhook(data, supabase);
        default:
            return NextResponse.json(
                { error: "Unsupported SendGrid action" },
                { status: 400 },
            );
    }
}

async function sendSendGridEmail(data: any, apiKey: string, supabase: any) {
    try {
        const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                personalizations: [
                    {
                        to: [{ email: data.to }],
                        subject: data.subject,
                    },
                ],
                from: { email: data.from || "noreply@proofoffit.com" },
                content: [
                    {
                        type: "text/html",
                        value: data.html,
                    },
                ],
                tracking_settings: {
                    click_tracking: { enable: true },
                    open_tracking: { enable: true },
                },
            }),
        });

        if (response.ok) {
            const messageId = response.headers.get("X-Message-Id");

            // Log successful email send
            await supabase
                .from("email_logs")
                .insert({
                    provider: "sendgrid",
                    action: "send",
                    recipient: data.to,
                    subject: data.subject,
                    status: "sent",
                    external_id: messageId,
                    created_at: new Date().toISOString(),
                });

            return NextResponse.json({
                success: true,
                data: { messageId },
            });
        } else {
            const error = await response.text();
            throw new Error(error);
        }
    } catch (error) {
        console.error("SendGrid email error:", error);
        return NextResponse.json(
            { error: "Failed to send email via SendGrid" },
            { status: 500 },
        );
    }
}

async function createSendGridTemplate(
    data: any,
    apiKey: string,
    supabase: any,
) {
    try {
        const response = await fetch("https://api.sendgrid.com/v3/templates", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: data.name,
                generation: "dynamic",
            }),
        });

        const result = await response.json();

        if (response.ok) {
            // Log template creation
            await supabase
                .from("email_templates")
                .insert({
                    provider: "sendgrid",
                    name: data.name,
                    external_id: result.id,
                    status: "created",
                    created_at: new Date().toISOString(),
                });

            return NextResponse.json({
                success: true,
                data: result,
            });
        } else {
            throw new Error(result.message || "Failed to create template");
        }
    } catch (error) {
        console.error("SendGrid template error:", error);
        return NextResponse.json(
            { error: "Failed to create template via SendGrid" },
            { status: 500 },
        );
    }
}

async function handleSendGridWebhook(data: any, supabase: any) {
    // Handle SendGrid webhook events
    await supabase
        .from("email_events")
        .insert({
            provider: "sendgrid",
            event_type: data.event,
            email_id: data.sg_message_id,
            recipient: data.email,
            status: data.event,
            metadata: data,
            created_at: new Date().toISOString(),
        });

    return NextResponse.json({ success: true });
}

async function handleMailgunIntegration(
    action: string,
    data: any,
    supabase: any,
) {
    const mailgunApiKey = process.env.MAILGUN_API_KEY;
    const mailgunDomain = process.env.MAILGUN_DOMAIN;

    if (!mailgunApiKey || !mailgunDomain) {
        return NextResponse.json(
            { error: "Mailgun configuration missing" },
            { status: 500 },
        );
    }

    switch (action) {
        case "send":
            return await sendMailgunEmail(
                data,
                mailgunApiKey,
                mailgunDomain,
                supabase,
            );
        case "webhook":
            return await handleMailgunWebhook(data, supabase);
        default:
            return NextResponse.json(
                { error: "Unsupported Mailgun action" },
                { status: 400 },
            );
    }
}

async function sendMailgunEmail(
    data: any,
    apiKey: string,
    domain: string,
    supabase: any,
) {
    try {
        const formData = new FormData();
        formData.append("from", data.from || `ProofOfFit <noreply@${domain}>`);
        formData.append("to", data.to);
        formData.append("subject", data.subject);
        formData.append("html", data.html);
        if (data.text) formData.append("text", data.text);

        const response = await fetch(
            `https://api.mailgun.net/v3/${domain}/messages`,
            {
                method: "POST",
                headers: {
                    "Authorization": `Basic ${
                        Buffer.from(`api:${apiKey}`).toString("base64")
                    }`,
                },
                body: formData,
            },
        );

        const result = await response.json();

        if (response.ok) {
            // Log successful email send
            await supabase
                .from("email_logs")
                .insert({
                    provider: "mailgun",
                    action: "send",
                    recipient: data.to,
                    subject: data.subject,
                    status: "sent",
                    external_id: result.id,
                    metadata: result,
                    created_at: new Date().toISOString(),
                });

            return NextResponse.json({
                success: true,
                data: result,
            });
        } else {
            throw new Error(result.message || "Failed to send email");
        }
    } catch (error) {
        console.error("Mailgun email error:", error);
        return NextResponse.json(
            { error: "Failed to send email via Mailgun" },
            { status: 500 },
        );
    }
}

async function handleMailgunWebhook(data: any, supabase: any) {
    // Handle Mailgun webhook events
    await supabase
        .from("email_events")
        .insert({
            provider: "mailgun",
            event_type: data.event,
            email_id: data["message-id"],
            recipient: data.recipient,
            status: data.event,
            metadata: data,
            created_at: new Date().toISOString(),
        });

    return NextResponse.json({ success: true });
}

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const provider = searchParams.get("provider");

    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
    );

    try {
        if (provider) {
            // Get logs for specific provider
            const { data: logs, error } = await supabase
                .from("email_logs")
                .select("*")
                .eq("provider", provider)
                .order("created_at", { ascending: false })
                .limit(100);

            if (error) throw error;

            return NextResponse.json({
                success: true,
                data: logs,
            });
        } else {
            // Get all email logs
            const { data: logs, error } = await supabase
                .from("email_logs")
                .select("*")
                .order("created_at", { ascending: false })
                .limit(100);

            if (error) throw error;

            return NextResponse.json({
                success: true,
                data: logs,
            });
        }
    } catch (error) {
        console.error("Email logs error:", error);
        return NextResponse.json(
            { error: "Failed to fetch email logs" },
            { status: 500 },
        );
    }
}


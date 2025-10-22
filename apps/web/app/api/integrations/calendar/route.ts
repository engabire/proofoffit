import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Calendar integration APIs (Google Calendar, Outlook, Calendly, etc.)
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { provider, action, data } = body;

        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!,
        );

        switch (provider) {
            case "google":
                return await handleGoogleCalendarIntegration(
                    action,
                    data,
                    supabase,
                );
            case "outlook":
                return await handleOutlookIntegration(action, data, supabase);
            case "calendly":
                return await handleCalendlyIntegration(action, data, supabase);
            case "zoom":
                return await handleZoomIntegration(action, data, supabase);
            default:
                return NextResponse.json(
                    { error: "Unsupported calendar provider" },
                    { status: 400 },
                );
        }
    } catch (error) {
        console.error("Calendar integration error:", error);
        return NextResponse.json(
            { error: "Calendar integration failed" },
            { status: 500 },
        );
    }
}

async function handleGoogleCalendarIntegration(
    action: string,
    data: any,
    supabase: any,
) {
    const googleClientId = process.env.GOOGLE_CLIENT_ID;
    const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

    if (!googleClientId || !googleClientSecret) {
        return NextResponse.json(
            { error: "Google Calendar configuration missing" },
            { status: 500 },
        );
    }

    switch (action) {
        case "auth":
            return await initiateGoogleAuth(data, supabase);
        case "callback":
            return await handleGoogleCallback(data, supabase);
        case "create_event":
            return await createGoogleEvent(data, supabase);
        case "list_events":
            return await listGoogleEvents(data, supabase);
        case "update_event":
            return await updateGoogleEvent(data, supabase);
        case "delete_event":
            return await deleteGoogleEvent(data, supabase);
        case "webhook":
            return await handleGoogleWebhook(data, supabase);
        default:
            return NextResponse.json(
                { error: "Unsupported Google Calendar action" },
                { status: 400 },
            );
    }
}

async function initiateGoogleAuth(data: any, supabase: any) {
    const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
    authUrl.searchParams.set("client_id", process.env.GOOGLE_CLIENT_ID!);
    authUrl.searchParams.set(
        "redirect_uri",
        `${process.env.NEXT_PUBLIC_APP_URL}/api/integrations/calendar/callback/google`,
    );
    authUrl.searchParams.set("response_type", "code");
    authUrl.searchParams.set(
        "scope",
        "https://www.googleapis.com/auth/calendar",
    );
    authUrl.searchParams.set("access_type", "offline");
    authUrl.searchParams.set("prompt", "consent");
    authUrl.searchParams.set("state", data.userId || "default");

    // Store auth state
    await supabase
        .from("calendar_auth_states")
        .insert({
            user_id: data.userId,
            provider: "google",
            state: data.userId || "default",
            expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString(), // 10 minutes
            created_at: new Date().toISOString(),
        });

    return NextResponse.json({
        success: true,
        data: { authUrl: authUrl.toString() },
    });
}

async function handleGoogleCallback(data: any, supabase: any) {
    try {
        // Exchange code for tokens
        const tokenResponse = await fetch(
            "https://oauth2.googleapis.com/token",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: new URLSearchParams({
                    client_id: process.env.GOOGLE_CLIENT_ID!,
                    client_secret: process.env.GOOGLE_CLIENT_SECRET!,
                    code: data.code,
                    grant_type: "authorization_code",
                    redirect_uri:
                        `${process.env.NEXT_PUBLIC_APP_URL}/api/integrations/calendar/callback/google`,
                }),
            },
        );

        const tokens = await tokenResponse.json();

        if (!tokenResponse.ok) {
            throw new Error(
                tokens.error_description ||
                    "Failed to exchange code for tokens",
            );
        }

        // Get user info
        const userResponse = await fetch(
            "https://www.googleapis.com/oauth2/v2/userinfo",
            {
                headers: {
                    "Authorization": `Bearer ${tokens.access_token}`,
                },
            },
        );

        const userInfo = await userResponse.json();

        // Store calendar connection
        await supabase
            .from("calendar_connections")
            .upsert({
                user_id: data.state,
                provider: "google",
                external_user_id: userInfo.id,
                email: userInfo.email,
                access_token: tokens.access_token,
                refresh_token: tokens.refresh_token,
                token_expires_at: new Date(
                    Date.now() + tokens.expires_in * 1000,
                ).toISOString(),
                metadata: userInfo,
                status: "active",
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            });

        return NextResponse.json({
            success: true,
            data: { message: "Google Calendar connected successfully" },
        });
    } catch (error) {
        console.error("Google Calendar callback error:", error);
        return NextResponse.json(
            { error: "Failed to connect Google Calendar" },
            { status: 500 },
        );
    }
}

async function createGoogleEvent(data: any, supabase: any) {
    try {
        // Get user's calendar connection
        const { data: connection, error: connError } = await supabase
            .from("calendar_connections")
            .select("*")
            .eq("user_id", data.userId)
            .eq("provider", "google")
            .eq("status", "active")
            .single();

        if (connError || !connection) {
            return NextResponse.json(
                { error: "Google Calendar not connected" },
                { status: 400 },
            );
        }

        // Check if token needs refresh
        const accessToken = await refreshGoogleTokenIfNeeded(
            connection,
            supabase,
        );

        // Create event
        const eventResponse = await fetch(
            "https://www.googleapis.com/calendar/v3/calendars/primary/events",
            {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    summary: data.title,
                    description: data.description,
                    start: {
                        dateTime: data.startTime,
                        timeZone: data.timeZone || "UTC",
                    },
                    end: {
                        dateTime: data.endTime,
                        timeZone: data.timeZone || "UTC",
                    },
                    attendees:
                        data.attendees?.map((email: string) => ({ email })) ||
                        [],
                    location: data.location,
                    conferenceData: data.createMeeting
                        ? {
                            createRequest: {
                                requestId: `proofoffit-${Date.now()}`,
                                conferenceSolutionKey: { type: "hangoutsMeet" },
                            },
                        }
                        : undefined,
                }),
            },
        );

        const event = await eventResponse.json();

        if (!eventResponse.ok) {
            throw new Error(event.error?.message || "Failed to create event");
        }

        // Log event creation
        await supabase
            .from("calendar_events")
            .insert({
                user_id: data.userId,
                provider: "google",
                external_event_id: event.id,
                title: data.title,
                start_time: data.startTime,
                end_time: data.endTime,
                attendees: data.attendees || [],
                status: "created",
                metadata: event,
                created_at: new Date().toISOString(),
            });

        return NextResponse.json({
            success: true,
            data: event,
        });
    } catch (error) {
        console.error("Google Calendar event creation error:", error);
        return NextResponse.json(
            { error: "Failed to create Google Calendar event" },
            { status: 500 },
        );
    }
}

async function listGoogleEvents(data: any, supabase: any) {
    try {
        // Get user's calendar connection
        const { data: connection, error: connError } = await supabase
            .from("calendar_connections")
            .select("*")
            .eq("user_id", data.userId)
            .eq("provider", "google")
            .eq("status", "active")
            .single();

        if (connError || !connection) {
            return NextResponse.json(
                { error: "Google Calendar not connected" },
                { status: 400 },
            );
        }

        const accessToken = await refreshGoogleTokenIfNeeded(
            connection,
            supabase,
        );

        // List events
        const eventsResponse = await fetch(
            `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${
                data.timeMin || new Date().toISOString()
            }&timeMax=${
                data.timeMax ||
                new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
            }&singleEvents=true&orderBy=startTime`,
            {
                headers: {
                    "Authorization": `Bearer ${accessToken}`,
                },
            },
        );

        const events = await eventsResponse.json();

        if (!eventsResponse.ok) {
            throw new Error(events.error?.message || "Failed to list events");
        }

        return NextResponse.json({
            success: true,
            data: events.items || [],
        });
    } catch (error) {
        console.error("Google Calendar list events error:", error);
        return NextResponse.json(
            { error: "Failed to list Google Calendar events" },
            { status: 500 },
        );
    }
}

async function updateGoogleEvent(data: any, supabase: any) {
    try {
        // Get user's calendar connection
        const { data: connection, error: connError } = await supabase
            .from("calendar_connections")
            .select("*")
            .eq("user_id", data.userId)
            .eq("provider", "google")
            .eq("status", "active")
            .single();

        if (connError || !connection) {
            return NextResponse.json(
                { error: "Google Calendar not connected" },
                { status: 400 },
            );
        }

        const accessToken = await refreshGoogleTokenIfNeeded(
            connection,
            supabase,
        );

        // Update event
        const eventResponse = await fetch(
            `https://www.googleapis.com/calendar/v3/calendars/primary/events/${data.eventId}`,
            {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    summary: data.title,
                    description: data.description,
                    start: {
                        dateTime: data.startTime,
                        timeZone: data.timeZone || "UTC",
                    },
                    end: {
                        dateTime: data.endTime,
                        timeZone: data.timeZone || "UTC",
                    },
                    attendees:
                        data.attendees?.map((email: string) => ({ email })) ||
                        [],
                    location: data.location,
                }),
            },
        );

        const event = await eventResponse.json();

        if (!eventResponse.ok) {
            throw new Error(event.error?.message || "Failed to update event");
        }

        // Log event update
        await supabase
            .from("calendar_events")
            .update({
                title: data.title,
                start_time: data.startTime,
                end_time: data.endTime,
                attendees: data.attendees || [],
                status: "updated",
                metadata: event,
                updated_at: new Date().toISOString(),
            })
            .eq("external_event_id", data.eventId);

        return NextResponse.json({
            success: true,
            data: event,
        });
    } catch (error) {
        console.error("Google Calendar event update error:", error);
        return NextResponse.json(
            { error: "Failed to update Google Calendar event" },
            { status: 500 },
        );
    }
}

async function deleteGoogleEvent(data: any, supabase: any) {
    try {
        // Get user's calendar connection
        const { data: connection, error: connError } = await supabase
            .from("calendar_connections")
            .select("*")
            .eq("user_id", data.userId)
            .eq("provider", "google")
            .eq("status", "active")
            .single();

        if (connError || !connection) {
            return NextResponse.json(
                { error: "Google Calendar not connected" },
                { status: 400 },
            );
        }

        const accessToken = await refreshGoogleTokenIfNeeded(
            connection,
            supabase,
        );

        // Delete event
        const eventResponse = await fetch(
            `https://www.googleapis.com/calendar/v3/calendars/primary/events/${data.eventId}`,
            {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${accessToken}`,
                },
            },
        );

        if (!eventResponse.ok) {
            const error = await eventResponse.json();
            throw new Error(error.error?.message || "Failed to delete event");
        }

        // Log event deletion
        await supabase
            .from("calendar_events")
            .update({
                status: "deleted",
                updated_at: new Date().toISOString(),
            })
            .eq("external_event_id", data.eventId);

        return NextResponse.json({
            success: true,
            data: { message: "Event deleted successfully" },
        });
    } catch (error) {
        console.error("Google Calendar event deletion error:", error);
        return NextResponse.json(
            { error: "Failed to delete Google Calendar event" },
            { status: 500 },
        );
    }
}

async function handleGoogleWebhook(data: any, supabase: any) {
    // Handle Google Calendar webhook events
    await supabase
        .from("calendar_events")
        .insert({
            user_id: data.userId,
            provider: "google",
            external_event_id: data.eventId,
            event_type: data.eventType,
            status: data.eventType,
            metadata: data,
            created_at: new Date().toISOString(),
        });

    return NextResponse.json({ success: true });
}

async function refreshGoogleTokenIfNeeded(
    connection: any,
    supabase: any,
): Promise<string> {
    if (new Date(connection.token_expires_at) > new Date()) {
        return connection.access_token;
    }

    try {
        const tokenResponse = await fetch(
            "https://oauth2.googleapis.com/token",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: new URLSearchParams({
                    client_id: process.env.GOOGLE_CLIENT_ID!,
                    client_secret: process.env.GOOGLE_CLIENT_SECRET!,
                    refresh_token: connection.refresh_token,
                    grant_type: "refresh_token",
                }),
            },
        );

        const tokens = await tokenResponse.json();

        if (tokenResponse.ok) {
            // Update stored tokens
            await supabase
                .from("calendar_connections")
                .update({
                    access_token: tokens.access_token,
                    token_expires_at: new Date(
                        Date.now() + tokens.expires_in * 1000,
                    ).toISOString(),
                    updated_at: new Date().toISOString(),
                })
                .eq("id", connection.id);

            return tokens.access_token;
        } else {
            throw new Error("Failed to refresh token");
        }
    } catch (error) {
        console.error("Token refresh error:", error);
        throw error;
    }
}

async function handleOutlookIntegration(
    action: string,
    data: any,
    supabase: any,
) {
    // Outlook Calendar integration (similar to Google Calendar)
    return NextResponse.json({
        success: true,
        data: { message: "Outlook integration coming soon" },
    });
}

async function handleCalendlyIntegration(
    action: string,
    data: any,
    supabase: any,
) {
    const calendlyApiKey = process.env.CALENDLY_API_KEY;
    if (!calendlyApiKey) {
        return NextResponse.json(
            { error: "Calendly API key not configured" },
            { status: 500 },
        );
    }

    switch (action) {
        case "create_event_type":
            return await createCalendlyEventType(
                data,
                calendlyApiKey,
                supabase,
            );
        case "list_event_types":
            return await listCalendlyEventTypes(data, calendlyApiKey, supabase);
        case "create_scheduling_link":
            return await createCalendlySchedulingLink(
                data,
                calendlyApiKey,
                supabase,
            );
        case "webhook":
            return await handleCalendlyWebhook(data, supabase);
        default:
            return NextResponse.json(
                { error: "Unsupported Calendly action" },
                { status: 400 },
            );
    }
}

async function createCalendlyEventType(
    data: any,
    apiKey: string,
    supabase: any,
) {
    try {
        const response = await fetch("https://api.calendly.com/event_types", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: data.name,
                duration: data.duration || 30,
                kind: "solo",
                scheduling_url: data.schedulingUrl,
                internal_note: data.internalNote,
                description_plain: data.description,
                profile: {
                    type: "User",
                    owner: data.userUri,
                },
            }),
        });

        const result = await response.json();

        if (response.ok) {
            // Log event type creation
            await supabase
                .from("calendly_event_types")
                .insert({
                    user_id: data.userId,
                    external_id: result.resource.uri,
                    name: data.name,
                    duration: data.duration || 30,
                    status: "active",
                    metadata: result,
                    created_at: new Date().toISOString(),
                });

            return NextResponse.json({
                success: true,
                data: result,
            });
        } else {
            throw new Error(result.message || "Failed to create event type");
        }
    } catch (error) {
        console.error("Calendly event type creation error:", error);
        return NextResponse.json(
            { error: "Failed to create Calendly event type" },
            { status: 500 },
        );
    }
}

async function listCalendlyEventTypes(
    data: any,
    apiKey: string,
    supabase: any,
) {
    try {
        const response = await fetch(
            `https://api.calendly.com/event_types?user=${data.userUri}`,
            {
                headers: {
                    "Authorization": `Bearer ${apiKey}`,
                },
            },
        );

        const result = await response.json();

        if (response.ok) {
            return NextResponse.json({
                success: true,
                data: result,
            });
        } else {
            throw new Error(result.message || "Failed to list event types");
        }
    } catch (error) {
        console.error("Calendly list event types error:", error);
        return NextResponse.json(
            { error: "Failed to list Calendly event types" },
            { status: 500 },
        );
    }
}

async function createCalendlySchedulingLink(
    data: any,
    apiKey: string,
    supabase: any,
) {
    try {
        const response = await fetch(
            "https://api.calendly.com/scheduling_links",
            {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${apiKey}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    owner: data.ownerUri,
                    owner_type: "EventType",
                    max_event_count: data.maxEventCount || 1,
                }),
            },
        );

        const result = await response.json();

        if (response.ok) {
            return NextResponse.json({
                success: true,
                data: result,
            });
        } else {
            throw new Error(
                result.message || "Failed to create scheduling link",
            );
        }
    } catch (error) {
        console.error("Calendly scheduling link creation error:", error);
        return NextResponse.json(
            { error: "Failed to create Calendly scheduling link" },
            { status: 500 },
        );
    }
}

async function handleCalendlyWebhook(data: any, supabase: any) {
    // Handle Calendly webhook events
    await supabase
        .from("calendly_events")
        .insert({
            user_id: data.userId,
            event_type: data.event,
            external_event_id: data.payload?.event?.uri,
            status: data.event,
            metadata: data,
            created_at: new Date().toISOString(),
        });

    return NextResponse.json({ success: true });
}

async function handleZoomIntegration(action: string, data: any, supabase: any) {
    const zoomApiKey = process.env.ZOOM_API_KEY;
    const zoomApiSecret = process.env.ZOOM_API_SECRET;

    if (!zoomApiKey || !zoomApiSecret) {
        return NextResponse.json(
            { error: "Zoom configuration missing" },
            { status: 500 },
        );
    }

    switch (action) {
        case "create_meeting":
            return await createZoomMeeting(
                data,
                zoomApiKey,
                zoomApiSecret,
                supabase,
            );
        case "webhook":
            return await handleZoomWebhook(data, supabase);
        default:
            return NextResponse.json(
                { error: "Unsupported Zoom action" },
                { status: 400 },
            );
    }
}

async function createZoomMeeting(
    data: any,
    apiKey: string,
    apiSecret: string,
    supabase: any,
) {
    try {
        // Generate JWT token for Zoom API
        const jwt = require("jsonwebtoken");
        const token = jwt.sign(
            {
                iss: apiKey,
                exp: Math.floor(Date.now() / 1000) + 3600,
            },
            apiSecret,
        );

        const response = await fetch(
            "https://api.zoom.us/v2/users/me/meetings",
            {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    topic: data.topic,
                    type: 2, // Scheduled meeting
                    start_time: data.startTime,
                    duration: data.duration || 60,
                    timezone: data.timezone || "UTC",
                    agenda: data.agenda,
                    settings: {
                        host_video: true,
                        participant_video: true,
                        join_before_host: false,
                        mute_upon_entry: true,
                        watermark: false,
                        use_pmi: false,
                        approval_type: 0,
                        audio: "both",
                        auto_recording: "none",
                    },
                }),
            },
        );

        const result = await response.json();

        if (response.ok) {
            // Log meeting creation
            await supabase
                .from("zoom_meetings")
                .insert({
                    user_id: data.userId,
                    external_meeting_id: result.id,
                    topic: data.topic,
                    start_time: data.startTime,
                    duration: data.duration || 60,
                    join_url: result.join_url,
                    status: "created",
                    metadata: result,
                    created_at: new Date().toISOString(),
                });

            return NextResponse.json({
                success: true,
                data: result,
            });
        } else {
            throw new Error(result.message || "Failed to create meeting");
        }
    } catch (error) {
        console.error("Zoom meeting creation error:", error);
        return NextResponse.json(
            { error: "Failed to create Zoom meeting" },
            { status: 500 },
        );
    }
}

async function handleZoomWebhook(data: any, supabase: any) {
    // Handle Zoom webhook events
    await supabase
        .from("zoom_events")
        .insert({
            user_id: data.userId,
            event_type: data.event,
            external_meeting_id: data.payload?.object?.id,
            status: data.event,
            metadata: data,
            created_at: new Date().toISOString(),
        });

    return NextResponse.json({ success: true });
}

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const provider = searchParams.get("provider");

    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
    );

    try {
        if (userId && provider) {
            // Get user's calendar connections for specific provider
            const { data: connections, error } = await supabase
                .from("calendar_connections")
                .select("*")
                .eq("user_id", userId)
                .eq("provider", provider)
                .eq("status", "active");

            if (error) throw error;

            return NextResponse.json({
                success: true,
                data: connections,
            });
        } else if (userId) {
            // Get all calendar connections for user
            const { data: connections, error } = await supabase
                .from("calendar_connections")
                .select("*")
                .eq("user_id", userId)
                .eq("status", "active");

            if (error) throw error;

            return NextResponse.json({
                success: true,
                data: connections,
            });
        } else {
            return NextResponse.json(
                { error: "userId parameter is required" },
                { status: 400 },
            );
        }
    } catch (error) {
        console.error("Calendar connections error:", error);
        return NextResponse.json(
            { error: "Failed to fetch calendar connections" },
            { status: 500 },
        );
    }
}


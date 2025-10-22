import { describe, expect, it } from "vitest";
import { GET, HEAD } from "@/app/api/health/route";

describe("api/health route", () => {
  it("responds to GET with ok status and telemetry metadata", async () => {
    const response = await GET();
    expect(response.status).toBe(200);
    expect(response.headers.get("x-health-status")).toBe("ok");

    const body = await response.json();
    expect(body.status).toBe("ok");
    expect(typeof body.timestamp).toBe("string");
    expect(typeof body.uptimeSeconds).toBe("number");
  });

  it("responds to HEAD with no content and custom headers", () => {
    const response = HEAD();
    expect(response.status).toBe(204);
    expect(response.headers.get("x-health-status")).toBe("ok");
    expect(response.headers.has("x-health-uptime-seconds")).toBe(true);
  });
});

import { makeToken, makeSecureToken } from "@/lib/token";

describe("Token Generation", () => {
  test("should generate valid tokens", () => {
    const token = makeToken();
    expect(token).toBeDefined();
    expect(token.length).toBeGreaterThan(0);
    expect(typeof token).toBe("string");
  });

  test("should generate unique tokens", () => {
    const token1 = makeToken();
    const token2 = makeToken();
    expect(token1).not.toBe(token2);
  });

  test("should generate secure tokens", () => {
    const token = makeSecureToken();
    expect(token).toBeDefined();
    expect(token.length).toBeGreaterThan(0);
    expect(typeof token).toBe("string");
  });

  test("should generate base64url format", () => {
    const token = makeToken();
    // Base64url characters: A-Z, a-z, 0-9, -, _
    expect(token).toMatch(/^[A-Za-z0-9_-]+$/);
  });
});

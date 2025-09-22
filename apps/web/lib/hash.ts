import crypto from "crypto";

const KEY = process.env.POF_HASH_KEY || "default-key-rotate-monthly";

export function hmac(input: string): string {
  return crypto.createHmac("sha256", KEY).update(input).digest("base64url");
}

export function hash(input: string): string {
  return crypto.createHash("sha256").update(input).digest("base64url");
}

export function rotateHashKey(): string {
  return crypto.randomBytes(32).toString("base64url");
}






import { randomBytes } from "crypto";

export function makeToken(): string {
  return randomBytes(16).toString("base64url");
}

export function makeSecureToken(): string {
  return randomBytes(32).toString("base64url");
}





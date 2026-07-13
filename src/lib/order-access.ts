import { createHash, randomBytes, timingSafeEqual } from "crypto";

function digest(token: string): Buffer {
  return createHash("sha256").update(token).digest();
}

export function createOrderAccessToken(): {
  token: string;
  hash: string;
} {
  const token = randomBytes(32).toString("base64url");
  return { token, hash: digest(token).toString("hex") };
}

export function verifyOrderAccessToken(token: string, storedHash: string): boolean {
  const actual = digest(token);
  const expected = Buffer.from(storedHash, "hex");
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

// @vitest-environment node
import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import { SignJWT } from "jose";

// vi.mock is hoisted to the top of the file, so mockCookieStore must also
// be hoisted via vi.hoisted so it's available inside the factory.
const mockCookieStore = vi.hoisted(() => ({
  set: vi.fn(),
  get: vi.fn(),
  delete: vi.fn(),
}));

vi.mock("server-only", () => ({}));

vi.mock("next/headers", () => ({
  cookies: vi.fn().mockResolvedValue(mockCookieStore),
}));

import { createSession } from "@/lib/auth";

// Must match the fallback secret in auth.ts
const JWT_SECRET = new TextEncoder().encode("development-secret-key");
const COOKIE_NAME = "auth-token";

beforeEach(() => {
  vi.clearAllMocks();
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("createSession", () => {
  test("sets an httpOnly cookie", async () => {
    await createSession("user-1", "user@example.com");

    expect(mockCookieStore.set).toHaveBeenCalledOnce();
    const [name, , options] = mockCookieStore.set.mock.calls[0];
    expect(name).toBe(COOKIE_NAME);
    expect(options.httpOnly).toBe(true);
    expect(options.sameSite).toBe("lax");
    expect(options.path).toBe("/");
  });

  test("cookie token is a valid JWT containing userId and email", async () => {
    await createSession("user-1", "user@example.com");

    const token = mockCookieStore.set.mock.calls[0][1] as string;
    const { jwtVerify } = await import("jose");
    const { payload } = await jwtVerify(token, JWT_SECRET);

    expect(payload.userId).toBe("user-1");
    expect(payload.email).toBe("user@example.com");
  });

  test("cookie expires ~7 days from now", async () => {
    const before = Date.now();
    await createSession("user-1", "user@example.com");
    const after = Date.now();

    const expires: Date = mockCookieStore.set.mock.calls[0][2].expires;
    const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;

    expect(expires.getTime()).toBeGreaterThanOrEqual(before + sevenDaysMs - 1000);
    expect(expires.getTime()).toBeLessThanOrEqual(after + sevenDaysMs + 1000);
  });

  test("secure flag is false outside production", async () => {
    await createSession("user-1", "user@example.com");

    const options = mockCookieStore.set.mock.calls[0][2];
    expect(options.secure).toBe(false);
  });

  test("secure flag is true in production", async () => {
    vi.stubEnv("NODE_ENV", "production");

    await createSession("user-1", "user@example.com");

    const options = mockCookieStore.set.mock.calls[0][2];
    expect(options.secure).toBe(true);
  });
});

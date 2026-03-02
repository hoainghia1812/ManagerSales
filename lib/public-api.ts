import { NextResponse } from "next/server";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type,Authorization,apikey,x-api-key,x-client-info",
  "Access-Control-Max-Age": "86400",
} as const;

export function publicOptions(): Response {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export function publicJson(data: unknown, init?: { status?: number }): Response {
  const res = NextResponse.json(data, { status: init?.status ?? 200 });
  Object.entries(CORS_HEADERS).forEach(([k, v]) => res.headers.set(k, v));
  return res;
}

function getWriteKeyFromRequest(request: Request): string | null {
  const headerKey = request.headers.get("x-api-key");
  if (headerKey) return headerKey;

  const auth = request.headers.get("authorization");
  if (!auth) return null;
  const match = auth.match(/^Bearer\s+(.+)$/i);
  return match?.[1] ?? null;
}

export function requirePublicWriteKey(request: Request): Response | null {
  const expected = process.env.PUBLIC_API_WRITE_KEY;
  if (!expected) {
    return publicJson(
      { error: "Server chưa cấu hình PUBLIC_API_WRITE_KEY" },
      { status: 500 }
    );
  }

  const provided = getWriteKeyFromRequest(request);
  if (!provided || provided !== expected) {
    return publicJson({ error: "Unauthorized" }, { status: 401 });
  }

  return null;
}


import { NextResponse } from "next/server";
import { ZodError } from "zod";
import type { PaginationMeta } from "@/lib/types/database";
import { paginationSchema, type PaginationParams } from "@/lib/validators";

// Standard success response
export function ok<T>(data: T, status = 200) {
  return NextResponse.json({ data }, { status });
}

// Paginated list response
export function paginated<T>(data: T[], meta: PaginationMeta) {
  return NextResponse.json({ data, pagination: meta });
}

// Error response
export function fail(message: string, status = 400, details?: string) {
  return NextResponse.json(
    { error: message, ...(details ? { details } : {}) },
    { status }
  );
}

// Parse and validate pagination params from URL searchParams
export function parsePagination(searchParams: URLSearchParams): PaginationParams {
  const raw = Object.fromEntries(searchParams.entries());
  return paginationSchema.parse(raw);
}

// Convert pagination params to Supabase range
export function toRange(params: PaginationParams): { from: number; to: number } {
  const from = (params.page - 1) * params.limit;
  const to = from + params.limit - 1;
  return { from, to };
}

// Build pagination metadata
export function buildPaginationMeta(
  total: number,
  params: PaginationParams
): PaginationMeta {
  return {
    page: params.page,
    limit: params.limit,
    total,
    totalPages: Math.ceil(total / params.limit),
  };
}

// Handle common errors in API routes
export function handleError(error: unknown) {
  if (error instanceof ZodError) {
    const messages = error.errors.map((e) => `${e.path.join(".")}: ${e.message}`);
    return fail("Dữ liệu không hợp lệ", 422, messages.join("; "));
  }

  if (error instanceof Error) {
    console.error("[API Error]", error.message);
    return fail(error.message, 500);
  }

  console.error("[API Error]", error);
  return fail("Lỗi hệ thống", 500);
}

// Generate slug from Vietnamese text
export function generateSlug(text: string): string {
  const map: Record<string, string> = {
    à: "a", á: "a", ả: "a", ã: "a", ạ: "a",
    ă: "a", ằ: "a", ắ: "a", ẳ: "a", ẵ: "a", ặ: "a",
    â: "a", ầ: "a", ấ: "a", ẩ: "a", ẫ: "a", ậ: "a",
    è: "e", é: "e", ẻ: "e", ẽ: "e", ẹ: "e",
    ê: "e", ề: "e", ế: "e", ể: "e", ễ: "e", ệ: "e",
    ì: "i", í: "i", ỉ: "i", ĩ: "i", ị: "i",
    ò: "o", ó: "o", ỏ: "o", õ: "o", ọ: "o",
    ô: "o", ồ: "o", ố: "o", ổ: "o", ỗ: "o", ộ: "o",
    ơ: "o", ờ: "o", ớ: "o", ở: "o", ỡ: "o", ợ: "o",
    ù: "u", ú: "u", ủ: "u", ũ: "u", ụ: "u",
    ư: "u", ừ: "u", ứ: "u", ử: "u", ữ: "u", ự: "u",
    ỳ: "y", ý: "y", ỷ: "y", ỹ: "y", ỵ: "y",
    đ: "d",
  };

  return text
    .toLowerCase()
    .split("")
    .map((char) => map[char] || char)
    .join("")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

import { supabaseAdmin } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const rawEmail = searchParams.get("email") ?? "";
    const email = rawEmail.trim().toLowerCase();

    if (!email) {
      return NextResponse.json({ error: "Missing email" }, { status: 400 });
    }

    // Dùng Supabase Admin API để liệt kê user rồi kiểm tra theo email
    const { data, error } = await supabaseAdmin.auth.admin.listUsers({
      page: 1,
      perPage: 100,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const exists =
      data?.users?.some(
        (u) => (u.email ?? "").trim().toLowerCase() === email
      ) ?? false;

    return NextResponse.json({ exists });
  } catch {
    return NextResponse.json({ error: "Lỗi hệ thống" }, { status: 500 });
  }
}


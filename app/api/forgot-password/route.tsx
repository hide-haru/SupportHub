import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ exists: false, error: "Email is required" }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin.auth.admin.listUsers();
    if (error) throw error;

    // メール一致をチェック
    const exists = data.users.some((u) => u.email === email);

    return NextResponse.json({ exists });
  } catch (err: any) {
    console.error("check-email error:", err);
    return NextResponse.json({ exists: false, error: err.message }, { status: 500 });
  }
}

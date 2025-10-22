import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { NextResponse } from "next/server";

//------------------------------------
// パスワード変更 API
//------------------------------------
export async function PUT(request: Request) {
    console.log("aaaa")
  try {
    const { id, password } = await request.json();

    if (!id || !password) {
      return NextResponse.json(
        { error: "IDまたはパスワードが不足しています。" },
        { status: 400 }
      );
    }

    console.log("Updating password for user:", id);

    const { data, error } = await supabaseAdmin.auth.admin.updateUserById(id, {
      password,
    });

    if (error) {
      console.error("パスワード更新エラー:", error.message);
      return NextResponse.json(
        { error: "パスワード更新に失敗しました。" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "パスワードを更新しました。",
      userId: data.user?.id,
    });
  } catch (err) {
    console.error("サーバーエラー:", err);
    return NextResponse.json({ error: "登録失敗" }, { status: 500 });
  }
}

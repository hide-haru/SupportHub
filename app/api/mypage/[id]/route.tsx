import { supabase } from "@/lib/supabaseClient";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { NextRequest, NextResponse } from "next/server"


//------------------------------------
//マイページ情報の取得
//------------------------------------
export async function GET(req: NextRequest, context: { params: Promise<{ id: string }>} ) {
    try{
        
        const { id } = await context.params;
        const { data: selectData, error:selectError } = await supabase
            .from("profiles")
            .select("user_id,user_name")
            .eq("auth_id", id)
            .single()

        if (!selectData) {
            return NextResponse.json(
                { message: "該当データが存在しません。" },
                { status: 404 }
            );
        }
        const { data: emailData, error: emailError } = await supabase
        .rpc("get_user_email", { auth_id: id });

        if (emailError) {
            console.error("auth.users取得エラー:", emailError);
            return NextResponse.json({ message: "メール取得に失敗しました" }, { status: 500 });
        }

        if (!emailData || emailData.length === 0) {
            console.log("メールが見つかりません");
            return NextResponse.json({ message: "メールが存在しません" }, { status: 404 });
        }

        const email = emailData[0].email;

        return NextResponse.json({user_id: selectData?.user_id, user_name: selectData?.user_name, email:email});
    }catch(err){
        return NextResponse.json({error: "データ取得失敗"},{status:500});
    }
}


//------------------------------------
// マイページのアップデート
//------------------------------------

export async function PUT(request: Request) {
  try {
    const { id, userName, userId, eMail } = await request.json()
    console.log("PUTの開始　data:", "id:",id, "userName",userName, "userId",userId, "eMail",eMail)

    // --- ユーザID重複チェック ---
    const { data: checkUserData, error: checkError } = await supabase
      .from("profiles")
      .select("auth_id")
      .eq("user_id", Number(userId))
      .neq("auth_id", id)


    if (checkError) {
      console.error("UserID check error:", checkError)
      return NextResponse.json({ success: false, message: "ユーザ確認中にエラーが発生しました。" }, { status: 500 })
    }
    console.log("checkUserData",checkUserData)
    if (checkUserData && checkUserData.length > 0) {
      return NextResponse.json({ success: false, message: "ユーザIDが既に存在します。" })
    }

    // --- profiles テーブル更新（RPC呼び出し） ---
    const { data: updateData, error: updateError } = await supabase.rpc("update_user_and_tasks", {
        target_auth_id: id,
        new_user_id: userId,
        new_user_name: userName,
        new_email: eMail,
    })

    if (updateError || !updateData) {
      console.error("Supabase RPC error:", updateError)
      return NextResponse.json({ success: false, message: "データベース登録に失敗しました。" }, { status: 500 })
    }

    // --- 認証情報(auth.users)の更新 ---
    if (eMail) {
      const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(id, {
        ...(eMail ? { email: eMail } : {}),
      })


      if (authError) {
        console.error("Auth update error:", authError)
        return NextResponse.json({ success: false, message: "認証情報の更新に失敗しました。" }, { status: 500 })
      }
    }

    return NextResponse.json({ success: true, message: "ユーザ情報の変更に成功しました。" })
  } catch (err) {
    console.error("PUT /mypage error:", err)
    return NextResponse.json({ success: false, message: "登録処理中にエラーが発生しました。" }, { status: 500 })
  }
}
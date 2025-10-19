import { supabase } from "@/lib/supabaseClient";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try{
        console.log("ログインチェックの開始")
        const {userId, password} = await request.json();

        //ユーザIDの重複チェック
        const { data: profileData, error:profileError } = await supabase
            .from("profiles")
            .select(`auth_id`)
            .eq("user_id", userId)
            .maybeSingle();
        if (profileError || !profileData) {
            return NextResponse.json(
                { message: "ユーザIDまたはパスワードが違います。" },
                { status: 404 }
            );
        }
        console.log("ユーザIDの重複チェックを抜けました。", profileData)

        //削除済みユーザのチェック
        const { data: nondeleteData, error:nondeleteError } = await supabase
            .from("profiles")
            .select(`auth_id`)
            .eq("user_id", userId)
            .eq("is_deleted", 0)
            .maybeSingle();
        // ユーザーが存在しない場合 or エラーがある場合
        if (nondeleteError || !nondeleteData) {
            return NextResponse.json(
                { message: "削除済みのユーザです。" },
                { status: 404 }
            );
        }
        console.log("削除済みユーザの重複チェックを抜けました。", nondeleteData)

        const authId = profileData?.auth_id;
        console.log("authId:",authId)

        const { data: emailData, error: emailError } = await supabase
            .rpc("get_user_email", { auth_id: authId });

        if (emailError) {
            console.error("auth.users取得エラー:", emailError);
            return NextResponse.json({ message: "メール取得に失敗しました" }, { status: 500 });
        }

        if (!emailData || emailData.length === 0) {
            console.log("メールが見つかりません");
            return NextResponse.json({ message: "メールが存在しません" }, { status: 404 });
        }

        const email = emailData[0].email;

        return NextResponse.json({ email });

    }catch(err){
        console.error(err);
        return NextResponse.json({message: "サーバ内でエラーが発生しました。"})
    }
}
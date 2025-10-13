import { supabase } from "@/lib/supabaseClient";
import { NextResponse } from "next/server";

export async function POST(request: Request) {

    try {
        const {userName, userId, eMail, password} = await request.json();

        /*
        (一つの処理に任せる)
        ユーザIDの重複チェック
        ユーザID out of rangeの対策
        ユーザIDとメールアドレスチェックの対策
        */

        const { data, error } = await supabase.auth.signUp({
            email: eMail,
            password: password,
        });

        if (error) {
            console.error("サインアップ失敗:", error.message);
            return NextResponse.json({ message: error.message }, { status: 400 });
        }

        console.log("サインアップ成功:", data.user)

        const {data:insertData, error:insertError } = await supabase.from("profiles").insert({
            user_id: userId,
            user_name: userName,
            is_deleted: 0,
            auth_id: data.user?.id,
        });

        
        if (insertError) {
            console.error("Supabase error:", insertError);
            return NextResponse.json(
                { message: "データベース登録に失敗しました。" },
                { status: 500 }
            );
        }
        
        return NextResponse.json({message: "新規登録成功。認証メールを送信しました。"});
        
    }catch(err){
        return NextResponse.json({error: "登録失敗"},{status:500});
    }
}
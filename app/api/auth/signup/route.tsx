import { supabase } from "@/lib/supabaseClient";
import { NextResponse } from "next/server";



//------------------------------------
//サインアップ処理
//------------------------------------
export async function POST(request: Request) {

    try {
        const { userName, userId, eMail, password } = await request.json();

        //ユーザIDの重複チェック
        const { data: checkUserData } = await supabase
            .from("profiles")
            .select("*")
            .eq("user_id", userId)
        
        if(checkUserData && checkUserData.length > 0){
            console.log("aaa",checkUserData)
            return NextResponse.json({message: "ユーザIDが既に存在します。"})
        }


        //auth.usersの登録処理
        const { data, error } = await supabase.auth.signUp({
            email: eMail,
            password: password,
            options: {
                emailRedirectTo: process.env.NEXT_PUBLIC_REDIRECT_URL || "https://supporthub.vercel.app", // ← ここを追加！
            },
        });

        if (error) {
            console.error("サインアップ失敗:", error.message);
            return NextResponse.json({ message: "サインアップに失敗しました。"}, { status: 400 });
        }

        console.log("サインアップ成功:", data.user)


        //profilesの登録処理
        const {data:insertData, error:insertError } = await supabase.from("profiles").insert({
            user_id: userId,
            user_name: userName,
            is_deleted: 0,
            auth_id: data.user?.id,
        });
        
        if (insertError) {
            console.error("Supabase error:", insertError);
            return NextResponse.json({ message: "データベース登録に失敗しました。" },{ status: 500 });
        }
        
        return NextResponse.json({message: "新規登録成功。認証メールを送信しました。"});
        
    }catch(err){
        console.log({error: "新規登録に失敗しました。"},{status:500});
        return NextResponse.json({message: "新規登録に失敗しました。"});
    }
}
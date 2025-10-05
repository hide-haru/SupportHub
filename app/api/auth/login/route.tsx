import { supabase } from "@/lib/supabaseClient";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

/*
課題
１．JWTの発行
*/

export async function POST(request: Request) {
    try{
        const {userId, password} = await request.json();
        const { data, error } = await supabase.from("users").select("hashed_password").eq("user_id", userId).single()
        console.log(data);


        // ユーザーが存在しない場合 or エラーがある場合
        if (error || !data) {
            return NextResponse.json(
                { message: "ユーザーが存在しません。" },
                { status: 404 }
            );
        }

        const hashedpassword = data.hashed_password;
        console.log(data);

        //ハッシュ化されているパスワードと照合
        const match = await bcrypt.compare(password, hashedpassword);
            if (!match) {
                return NextResponse.json(
                    { message: "パスワードが違います。" },
                    { status: 401 }
                );
            }
        return NextResponse.json({message: "ログインに成功しました。"})
    }catch(err){
        console.error(err);
        return NextResponse.json({message: "サーバ内でエラーが発生しました。"})
    }
}
import { supabase } from "@/lib/supabaseClient";
import { NextResponse } from "next/server";
import { sendVerificationEmail } from "@/lib/nodemailer";
import { v4 as uuidv4 } from "uuid"; //メール認証用トークンとして使用

/*
課題
*/

export async function POST(request: Request) {

    try{
        const {userName, userId, eMail, password} = await request.json();

        //登録前にユーザIDとメールアドレス重複がないか確認
        const {count, error: checkError} = await supabase.from("users").select("*", { count: "exact", head: true }).or(`user_id.eq.${userId},e_mail.eq.${eMail}`);
        console.log(count);

        if (checkError) {
            console.error("Supabase error:", checkError);
            return NextResponse.json(
                { message: "検索中にエラーが発生しました。" },
                { status: 500 }
            );
        }

        if (count && count > 0){
            return NextResponse.json(
                {message: "同じユーザIDまたはメールアドレスが既に登録されています。"},
                {status: 400}
            );
        }



        try {
            //ユーザ登録作業の開始
            //パスワードのハッシュ化
            const bcrypt = require("bcrypt");
            const hashedPassword = await bcrypt.hash(password, 10);

            const verificationToken = uuidv4();
            console.log(verificationToken);
            const {data: insertData, error: insertError} = await supabase.from("users").insert({user_name: userName, user_id: userId, e_mail: eMail, hashed_password:hashedPassword, verificationtoken: verificationToken});

            if (insertError) {
                console.error("Supabase error:", insertError);
                return NextResponse.json(
                    { message: "データベース登録に失敗しました。" },
                    { status: 500 }
                );
            }

            await sendVerificationEmail(eMail, verificationToken);
            return NextResponse.json({message: "新規登録成功。認証メールを送信しました。"});
            
        }catch(err){
            return NextResponse.json({error: "登録失敗"},{status:500});
        }


    }catch(err){
        console.error(err);
        return NextResponse.json({message: "サーバ内でエラーが発生しました。"});
    }
}
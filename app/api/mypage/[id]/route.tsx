import { supabase } from "@/lib/supabaseClient";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { NextRequest, NextResponse } from "next/server"


//------------------------------------
//既存ユーザ情報の取得
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
//マイページのアップデート
//------------------------------------
export async function PUT(request:Request){
    try{
        const { id, userName, userId, eMail, password } = await request.json();

        console.log("profilesテーブルの更新に入る。")
        //profilesテーブル情報の変更
        const { data: updateData, error:updateError} = await supabase.rpc("update_user_and_tasks",{
            target_auth_id: id,
            new_user_id: userId,
            new_user_name: userName,
            new_email: eMail,
        });
            

        if (updateError) {
            console.error("Supabase error:", updateError);
            return NextResponse.json(
                { message: "データベース登録に失敗しました。" },
                { status: 500 }
            );
        }

        //auth.useresテーブル情報の変更
        const { data, error } = await supabaseAdmin.auth.admin.updateUserById(id, {
             email: eMail,
             password: password,
        });

        

        return NextResponse.json({message: "ユーザ情報の変更に成功しました。"});
    }catch(err){
        return NextResponse.json({error: "登録失敗"},{status:500});
    }
}
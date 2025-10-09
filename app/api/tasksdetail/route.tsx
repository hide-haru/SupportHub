import Tasks from "@/app/tasks/page";
import { supabase } from "@/lib/supabaseClient";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { sendTaskNewEmail } from "@/lib/nodemailer";

// ----------------------------------------
// タスク詳細の作成
// ----------------------------------------
export async function POST(request: Request) {
    try{
        const data = await request.json();

        const date = new Date();
        
        const {data: insertData, error: insertError} = await supabase
            .from("tasks")
            .insert([{
                customer_id: data.customer,
                inquiry_source: data.inquirySource,
                call_datetime: data.callDate,
                important: data.important,
                status_id: data.status,
                category_id: data.category,
                inquiry_title: data.inquiryTitle,
                inquiry_detail: data.inquiryDetail,
                remind_at: data.remindDate,
                assign_id: data.assignUser,
                send_mail: data.sendMail,
                created_at: date,
            }])
            .select("uniqueid");

            if (insertError) {
                console.error("Supabase error:", insertError);
                return NextResponse.json(
                    { message: "データベース登録に失敗しました。" },
                    { status: 500 }
                );
            }
        
        console.log(data);

        // 登録されたUUIDを取得
        const insertedId = insertData?.[0]?.uniqueid;
        console.log("登録されたUUID:", insertedId);
        await sendTaskNewEmail(data.sendMail, insertedId, data.inquiryTitle, data.inquiryDetail);
        return NextResponse.json({message: "登録成功"})
    }catch(err){
        return NextResponse.json({error: "登録失敗"},{status:500});
    }
}

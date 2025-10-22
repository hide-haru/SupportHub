import { supabase } from "@/lib/supabaseClient";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { sendTaskEditEmail } from "@/lib/nodemailer";

// ----------------------------------------
//タスク詳細の取得
// ----------------------------------------
export async function GET(req: NextRequest, context: { params: Promise<{ id: string }>} ) {
    try{
        const { id } = await context.params;
        console.log("id⇒",id)
        const {data: selectData, error:selectError} = await supabase
            .rpc('get_task_detail', { p_uniqueid: id });

            console.log(selectData)

            if (!selectData) {
                return NextResponse.json(
                    { message: "該当データが存在しません。" },
                    { status: 404 }
                );
            }

            const task = selectData[0];
            const flatData = {
                uniqueid: task.uniqueid,
                no: task.no,
                important: task.important,
                status_id: task.status_id,
                status: task.status_name,
                category_id: task.category_id,
                category: task.category_name,
                call_datetime: task.call_datetime,
                customer_id: task.customer_id,
                customer_name: task.customer_name,
                inquiry_source_id: task.employee_id,
                inquiry_source: task.employee_name,
                inquiry_title: task.inquiry_title,
                inquiry_detail: task.inquiry_detail,
                assign_user_id: task.user_id,
                assign_user: task.user_name,
                remind_at: task.remind_at,
                created_at: task.created_at,
                updated_at: task.updated_at,
                send_mail: task.send_mail,
                send_mail_user_name: task.send_mail_user_name
            };
            
            if (selectError) {
                console.error("Supabase error:", selectError);
                return NextResponse.json(
                    { message: "データ取得成功" },
                    { status: 500 }
                );
            }

            console.log(flatData)

            return NextResponse.json(flatData)
    }catch(err){
        return NextResponse.json({error: "データ取得失敗"},{status:500});
    }
}



// ----------------------------------------
//タスク詳細の更新
// ----------------------------------------

export async function PUT(req: NextRequest, context: { params: { id: string } }) {
  try {
    const { params } = context;
    const { id } = params;
    const bodyData = await req.json();

    console.log("サーバに送信されたデータ：", id);
    console.log("サーバに送信されたデータ：", bodyData);

    const {
      customer,
      inquirySource,
      callDate,
      important,
      status,
      category,
      inquiryTitle,
      inquiryDetail,
      remindDate,
      assignUser,
      sendMail,
    } = bodyData;

    const { data: updateData, error: updateError } = await supabase
      .from("tasks")
      .update({
            customer_id: bodyData.customer?.customer_id || null,
            inquiry_source: bodyData.inquirySource?.inquiry_source_id || null,
            call_datetime: callDate ? new Date(bodyData.callDate).toISOString() : null,
            important: bodyData.important,
            status_id: bodyData.status?.status_id || null,
            category_id: bodyData.category?.category_id || null,
            inquiry_title: bodyData.inquiryTitle,
            inquiry_detail: bodyData.inquiryDetail,
            remind_at: remindDate ? new Date(bodyData.remindDate).toISOString() : null,
            assign_id: bodyData.assignUser?.assign_user_id || null,
            send_mail: bodyData.sendMail?.send_mail || null,
            updated_at: new Date().toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" }),
            is_deleted: 0
      })
      .eq("uniqueid", id);

    if (updateError) {
      console.error("Supabase error:", updateError);
      return NextResponse.json(
        { message: "データベース登録に失敗しました。" },
        { status: 500 }
      );
    }

    // 登録されたUUIDを取得
    const insertedId = id;
    console.log("登録されたUUID:", insertedId);

   if(bodyData.sendMail?.send_mail){
      await sendTaskEditEmail(bodyData.sendMail?.send_mail, insertedId, bodyData.inquiryTitle, bodyData.inquiryDetail);
    }

    return NextResponse.json({ message: "データ修正成功" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "データ修正失敗" }, { status: 500 });
  }
}


// ----------------------------------------
//タスク詳細の削除
// ----------------------------------------
export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }>}) {
    try{
        const { id } = await context.params;
        const {data:updateData, error:updateError} = await supabase
            .from("tasks")
            .update({
                is_deleted: 1,
                deleted_at: new Date().toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" }),
            })
            .eq("uniqueid", id)

        if(updateError) {
            return NextResponse.json({ success: false, updateError});
        }

        return NextResponse.json({ success: true, updateData });
    }catch(err){
        return NextResponse.json({error: "データ削除失敗"},{status:500});
    }
}

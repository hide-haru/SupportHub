import { supabase } from "@/lib/supabaseClient";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

// ----------------------------------------
//タスク詳細の取得
// ----------------------------------------
export async function GET(req: NextRequest, context: { params: Promise<{ id: string }>} ) {
    try{
        const { id } = await context.params;
        console.log("id⇒",id)
        const {data: selectData, error:selectError} = await supabase
            .rpc('get_task_detail', { p_uniqueid: id });
            /*
            .from("tasks")
            .select(`uniqueid:uniqueid,
                    no:no,
                    important:important,
                    status:status_id(status_id,status_name),
                    category:category_id(category_id,category_name),
                    call_datetime:call_datetime,
                    customers:customer_id(customer_id,customer_name),
                    inquiry_source:inquiry_source(employee_id,employee_name),
                    inquiry_title:inquiry_title,
                    inquiry_detail:inquiry_detail,
                    assign_user:assign_id(user_id,user_name),
                    remind_at:remind_at,
                    created_at:created_at,
                    updated_at:updated_at`)
            .eq("uniqueid", id)
            .single()
            */

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
                    { message: "データベース登録に失敗しました。" },
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
export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }>}) {
    try{
        
    }catch(err){
        return NextResponse.json({error: "データ削除失敗"},{status:500});
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
                deleted_at: new Date().toISOString()
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

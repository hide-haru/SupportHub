import Tasks from "@/app/tasks/page";
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
            .from("tasks")
            //.select("no,customer_id,inquiry_source,call_datetime,important,status_id,category_id,inquiry_title,inquiry_detail,remind_at,assign_id,send_mail")
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

            console.log(selectData)

            if (!selectData) {
                return NextResponse.json(
                    { message: "該当データが存在しません。" },
                    { status: 404 }
                );
            }

            const task = selectData as any;

            const flatData = {
                uniqueid: task.uniqueid,
                no: task.no,
                important: task.important,
                status_id:task.status?.status_id ?? null,
                status: Array.isArray(task.status)
                    ? task.status[0]?.status_name ?? null
                    : task.status?.status_name ?? null,
                category_id:task.category?.category_id ?? null,
                category: Array.isArray(task.category)
                    ? task.category[0]?.category_name ?? null
                    : task.category?.category_name ?? null,
                call_datetime: task.call_datetime,
                customer_id:task.customers?.customer_id ?? null,
                customers: Array.isArray(task.customers)
                    ? task.customers[0]?.customer_name ?? null
                    : task.customers?.customer_name ?? null,
                inquiry_source_id:task.inquiry_source?.employee_id ?? null,
                inquiry_source: Array.isArray(task.inquiry_source)
                    ? task.inquiry_source[0]?.employee_name ?? null
                    : task.inquiry_source?.employee_name ?? null,
                inquiry_title: task.inquiry_title,
                inquiry_detail: task.inquiry_detail,
                assign_user_id:task.assign_user?.user_id ?? null,
                assign_user: Array.isArray(task.assign_user)
                    ? task.assign_user[0]?.user_name ?? null
                    : task.assign_user?.user_name ?? null,
                remind_at: task.remind_at,
                created_at: task.created_at,
                updated_at: task.updated_at,
            };

            if (selectError) {
                console.error("Supabase error:", selectError);
                return NextResponse.json(
                    { message: "データベース登録に失敗しました。" },
                    { status: 500 }
                );
            }

            return NextResponse.json(flatData)
    }catch(err){
        return NextResponse.json({error: "データ取得失敗"},{status:500});
    }
}



//タスク詳細の更新
export async function PUT() {
    
}



//タスク詳細の削除
export async function DELETE() {
    
}

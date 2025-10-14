import { supabase } from "@/lib/supabaseClient";
import { NextResponse } from "next/server";

export async function GET() {
    try {

      const { data,error } = await supabase.auth.getSession();
    //if (!session) return null;
    console.log("session data:", data);


        const {data: tasksdata, error: taskserror} = 
            await supabase.from("tasks")
                .select(`uniqueid:uniqueid,
                    no:no,
                    important:important,
                    status:status_id(status_name),
                    category:category_id(category_name),
                    call_datetime:call_datetime,
                    customers:customer_id(customer_name),
                    inquiry_source:inquiry_source(employee_name),
                    inquiry_title:inquiry_title,
                    detail_display:detail_display,
                    assign_user:assign_id(user_name),
                    remind_at:remind_at,
                    created_at:created_at,
                    updated_at:updated_at`)
                .eq("is_deleted", 0)
                .order('no', { ascending: true }); // 昇順;


        const flatData = (tasksdata as any[])?.map((task) => ({
          uniqueid: task.uniqueid,
          no: task.no,
          important: task.important,
          status: Array.isArray(task.status)
            ? task.status[0]?.status_name ?? null
            : task.status?.status_name ?? null,
          category: Array.isArray(task.category)
            ? task.category[0]?.category_name ?? null
            : task.category?.category_name ?? null,
          call_datetime: task.call_datetime,
          customers: Array.isArray(task.customers)
            ? task.customers[0]?.customer_name ?? null
            : task.customers?.customer_name ?? null,
          inquiry_title: task.inquiry_title,
          detail_display: task.detail_display,
          inquiry_source: Array.isArray(task.inquiry_source)
            ? task.inquiry_source[0]?.employee_name ?? null
            : task.inquiry_source?.employee_name ?? null,
          assign_user: Array.isArray(task.assign_user)
            ? task.assign_user[0]?.user_name ?? null
            : task.assign_user?.user_name ?? null,
          remind_at: task.remind_at,
          created_at: task.created_at,
          updated_at: task.updated_at,
        })) ?? [];
        return NextResponse.json(flatData);
    }catch(err){
        console.error(err);
        return NextResponse.json({message: "サーバ内でエラーが発生しました。"});
    }
}
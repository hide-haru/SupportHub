import { supabase } from "@/lib/supabaseClient";
import { NextRequest, NextResponse } from "next/server";


export async function GET(request: Request) {
    try{
        let targetDate: string[] = [];

        const { searchParams } = new URL(request.url);
        const searchDate = searchParams.get("searchDate");
        const dateFrom = searchParams.get("dateFrom");
        const dateTo = searchParams.get("dateTo");
        const important = searchParams.get("important");
        const status = searchParams.get("status");
        const category = searchParams.get("category");
        const customer = searchParams.get("customer");
        //console.log("受け取った検索条件:", { searchDate,dateFrom, dateTo, important, status, category, customer });

        // 日付対象カラム
        if (searchDate === "1") targetDate = ["call_datetime"];
        else if (searchDate === "2") targetDate = ["remind_at"];
        else if (searchDate === "3") targetDate = ["created_at"];
        else if (searchDate === "4") targetDate = ["updated_at"];
        else if (searchDate === "") targetDate = ["call_datetime", "remind_at", "created_at", "updated_at"];
        //console.log("検索対象日付カラム:", targetDate);

        //DB検索
        let query = supabase.from("tasks")
            .select(`uniqueid:uniqueid,
                    no:no,
                    important:important,
                    status:status_id(status_name),
                    category:category_id(category_name),
                    call_datetime:call_datetime,
                    customers:customer_id(customer_name),
                    inquiry_source:inquiry_source(employee_name),
                    inquiry_title:inquiry_title,
                    inquiry_detail:inquiry_detail,
                    assign_user:assign_id(user_name),
                    remind_at:remind_at,
                    created_at:created_at,
                    updated_at:updated_at`)
            .eq("is_deleted", '0')
            .order('no', { ascending: true }); // 昇順;

        if(important) query = query.eq("important", important);
        if (status) query = query.eq("status_id", status);
        if (category) query = query.eq("category_id", category);
        if (customer) query = query.eq("customer_id", customer);
        // 日付範囲
        if (dateFrom && dateTo && targetDate.length > 0) {
            if (targetDate.length > 1) {
                const orFilter = targetDate
                    .map(col => `(${col}.gte.${dateFrom}AND${col}.lte.${dateTo})`)
                    .join(','); // OR 条件として結合
                query = query.or(orFilter);
            } else {
                query = query.gte(targetDate[0], dateFrom).lte(targetDate[0], dateTo);
            }
        }

        //console.log(query);
        const { data: selectData, error: selectError } = await query;
        

        if (!selectData || selectData.length === 0) {
            return NextResponse.json({ message: "該当データがありません", data: [] });
        }

        const flatData = (selectData as any[])?.map((task) => ({
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
            inquiry_detail: task.inquiry_detail,
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

        console.log("検索結果:", flatData);
        return NextResponse.json(flatData);

    }catch(err){
        console.error(err);
        return NextResponse.json({message: "サーバ内でエラーが発生しました。"});
    }
}
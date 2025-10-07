import { supabase } from "@/lib/supabaseClient";
import { NextResponse } from "next/server";

export async function GET() {
    const {data, error} = await supabase.from ("customers_employee").select("employee_id, employee_name");

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log(data)

    return NextResponse.json({data});
}
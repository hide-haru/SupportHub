import { supabase } from "@/lib/supabaseClient";
import { NextResponse } from "next/server";

export async function fetchInquirySource(customer: string) {
    
    const {data, error} = await supabase.from ("customers_employee").select("employee_id, employee_name").eq("customer_id", customer);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }


    return NextResponse.json({data});
}
import { supabase } from "@/lib/supabaseClient";
import { NextResponse } from "next/server";

export async function fetchCutomers() {
    const {data, error} = await supabase.from ("customers").select("customer_id, customer_name");

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }


    return NextResponse.json({data});
}
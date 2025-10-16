import { supabase } from "@/lib/supabaseClient";
import { NextResponse } from "next/server";

export async function GET() {
    const {data, error} = await supabase.from ("category").select("category_id, category_name");

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }


    return NextResponse.json({data});
}

//v0フォークの確認（2025.10.16）
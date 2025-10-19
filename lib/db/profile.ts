import { supabase } from "@/lib/supabaseClient";
import { NextResponse } from "next/server";

export async function fetchProfile() {
    const {data, error} = await supabase.from ("profiles").select("auth_id");

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }


    return NextResponse.json({data});
}
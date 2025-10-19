import { supabase } from "@/lib/supabaseClient";
import { NextResponse } from "next/server";

export async function fetchUsers() {
    const {data, error} = await supabase.rpc("users_search");

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({data});
}
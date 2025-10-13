import { supabase } from "@/lib/supabaseClient";
import { NextRequest,NextResponse } from "next/server";

export async function POST(request:Request){
    try{
        const { userId } = await request.json();

        if (!userId) {
            return NextResponse.json({ error: "User ID is required" }, { status: 400 });
        }

        //------------------------------
        //関連データの論理削除（profiles）
        //------------------------------
        const { data: profileData, error:profileError} = await supabase
            .from("profiles")
            .update({is_deleted: 1})
            .eq("auth_id", userId);
            
        return NextResponse.json({ message: "User logically deleted successfully" });
    }catch(err){
        console.error("Delete API error:", err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
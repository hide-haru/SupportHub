import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const token = url.searchParams.get("token");

  console.log(token);

  if (!token) return NextResponse.json({ error: "トークンが無効です" }, { status: 400 });


  try{
    const { data, error } = await supabase.from("users").select("*").eq("verificationtoken",token).single();
    if(data){
        return NextResponse.json({ message: "メール認証完了しました。" });
    }else{
        return NextResponse.json({ message: "メール認証に失敗。" });
    }
    
  }catch(err){
    return NextResponse.json({ message: "メール認証に失敗しました。" });
  }

}

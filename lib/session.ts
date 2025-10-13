import { supabase } from "@/lib/supabaseClient";

export async function getAccessToken(): Promise<string | null> {
    const { data,error } = await supabase.auth.getSession();
    //if (!session) return null;
    //console.log("session data:", data);
    //console.log("session error:", error);
    const token = data.session?.access_token ?? null;
    console.log("session2",token);
    if (!data.session) {
        console.warn("⚠️ Supabaseにログインしていません。JWTなし");
        return null;
    }
    return data.session.access_token;
}
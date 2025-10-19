import { supabase } from "@/lib/supabaseClient";
import { redirect } from "next/dist/server/api-utils";

export async function sendResetEmail(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password`,
  });
  if (error) {
    console.error("Password reset email error:", error.message);
    return false;
  }
  return true;
}

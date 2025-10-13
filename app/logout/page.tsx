"use client";
"use strict";

import { useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function Logout() {
  const router = useRouter();

  useEffect(() => {
    const doLogout = async () => {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Logout failed:", error.message);
      } else {
        router.push("/login");
      }
    };
    doLogout();
  }, [router]);

  return <p>ログアウト中です...</p>;
}

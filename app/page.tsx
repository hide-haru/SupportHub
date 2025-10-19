"use strict";
"use client";

import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";



export default function Home() {
  const router = useRouter();

  const init = async () => {
    const { data, error } = await supabase.auth.getSession();
    
    //==================================================
    //セッション有無の処理
    //==================================================
    if (error || !data.session) {
      router.replace("/login");
      return;
    }else{
      router.replace("/tasks");
    }
  }

  init();
  
}
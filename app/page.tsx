"use strict";
"use client";

import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";



export default function Home() {

  const router = useRouter();

  const init = async () => {

    const { data, error } = await supabase.auth.getSession();
     console.log("data",data);

    if (error || !data.session) {
      router.replace("/login"); //セッションの取得が出来なかった場合
      return;
    }else{
      router.replace("/tasks"); //セッションの取得が出来た場合
    }

  }

  init();
  
}
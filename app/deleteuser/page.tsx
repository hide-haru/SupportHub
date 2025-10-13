"use strict";
"use client";

import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function DeleteAccountButton() {
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("本当に退会しますか？この操作は取り消せません。")) return;

    const user = supabase.auth.getUser();
    const userId = (await user).data.user?.id;

    console.log(userId)

    if (!userId) {
      alert("ユーザ情報が取得できません");
      return;
    }

    const res = await fetch("/api/deleteuser", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });

    const { error } = await supabase.auth.signOut();
    if (error) {
        console.error("Logout failed:", error.message);
    } else {
        router.push("/");
    };



    const data = await res.json();

    if (res.ok) {
      alert("退会しました。ありがとうございました。");
      await supabase.auth.signOut(); // ログアウト
      router.push("/"); // トップページへ
    } else {
      alert("エラー: " + data.error);
    }
  };
 

  return <button onClick={handleDelete} className="btn btn-danger">退会する</button>;
}

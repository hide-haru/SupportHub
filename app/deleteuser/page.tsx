"use strict";
"use client";

import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";

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


  return(
    <>
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <h1>退会しますか？</h1>
        <div className="flex gap-4">
          <Button onClick={handleDelete} className="bg-blue-600 text-white w-24">はい</Button>
          <Button onClick={() => router.back()} className="bg-blue-600 text-white w-24">いいえ</Button>
        </div>
      </div>
    </>
  );
   
}

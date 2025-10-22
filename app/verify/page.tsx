"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";



export default function VerifyPage() {

  const router = useRouter();

  const params = useSearchParams();
  const token = params.get("token");

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) return;

      try {
        const res = await fetch(`/api/auth/verify?token=${token}`);
        const data = await res.json();
        alert(data.message);

        // ✅ window.location.href の代わりに router.push()
        router.push("/tasks");
      } catch (err) {
        console.error("メール認証エラー:", err);
        alert("認証に失敗しました。再度お試しください。");
      }
    };

    verifyEmail();
  }, [token, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      メール認証中…
    </div>
  );
}

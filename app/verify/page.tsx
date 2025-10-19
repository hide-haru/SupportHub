"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";



export default function VerifyPage() {

  const router = useRouter();

  const params = useSearchParams();
  const token = params.get("token");

  useEffect(() => {
    if (token) {
      fetch(`http://localhost:3000/api/auth/verify?token=${token}`)
        .then(res => res.json())
        .then(data => alert(data.message));
        window.location.href = "/tasks";
    }
  }, [token]);

  return <div className="flex items-center justify-center min-h-screen">メール認証中…</div>;
  
}

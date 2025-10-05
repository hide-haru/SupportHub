"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function VerifyPage() {
  const params = useSearchParams();
  const token = params.get("token");

  useEffect(() => {
    if (token) {
      fetch(`http://localhost:3000/api/auth/verify?token=${token}`)
        .then(res => res.json())
        .then(data => alert(data.message));
    }
  }, [token]);

  return <div>メール認証中…</div>;
}

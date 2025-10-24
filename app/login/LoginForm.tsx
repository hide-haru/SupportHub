"use client";

import Link from "next/link";
import "./layout.css"
import { handleLogin } from "@/lib/auth/login";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const router = useRouter();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const userId = formData.get("userId") as string;
    const password = formData.get("password") as string;

    const success = await handleLogin(userId, password);
    if (success) {
      //window.location.href = "/tasks";
      router.push("/tasks");
    }
  };

  return (
    <>
      <Link href="/signup" className="signup-link">新規登録はこちら</Link>
      <h1>SupportHub</h1>
      <form onSubmit={handleSubmit}>
        <dl>
          <dt>ユーザID</dt>
          <dd>
            <input
              type="text"
              name="userId"
              placeholder="半角数字"
              onInput={(e) => {
                const target = e.target as HTMLInputElement;
                target.value = target.value.replace(/[^0-9]/g, "");
              }}
              required
            />
          </dd>
          <dt>パスワード</dt>
          <dd>
            <input
              type="password"
              name="password"
              placeholder="パスワード"
              onInput={(e) => {
                const target = e.target as HTMLInputElement;
                target.value = target.value.replace(/[^0-9a-zA-Z]/g, "");
              }}
              required
            />
          </dd>
          <button type="submit">ログイン</button>
        </dl>
      </form>
      <Link href="/forgot-password" className="forgot-password">
        パスワードを忘れた方はこちら
      </Link>
    </>
  );
}

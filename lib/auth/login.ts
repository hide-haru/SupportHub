import { supabase } from "@/lib/supabaseClient";

export async function handleLogin(userId: string, password: string): Promise<boolean> {
  try {
    // API 経由でユーザー情報を取得

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, password }),
    });

    const result = await response.json();
    if (!response.ok) {
      console.error("APIエラー:", result);
      alert(result.message);
      return false;
    }

    // Supabase ログイン
    const { data, error } = await supabase.auth.signInWithPassword({
      email: result.email,
      password,
    });

    if (error) {
      console.error("Supabaseログイン失敗:", error.message);
      alert("ユーザIDまたはパスワードが違います。");
      return false;
    }

    // ✅ サインイン成功時、セッションを保持
    if (data.session) {
      await supabase.auth.setSession(data.session);
      console.log("ログイン成功。セッション保持完了。");
      return true;
    } else {
      console.error("セッションが取得できませんでした");
      return false;
    }
  } catch (err) {
    console.error("通信エラー:", err);
    alert("サーバとの通信に失敗しました。");
    return false;
  }
}

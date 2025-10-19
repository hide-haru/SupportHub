"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function ResetPasswordPage() {

  const router = useRouter();

  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setMessage("エラーが発生しました: " + error.message);
    } else {
      setMessage("パスワードが更新されました。ログインページへ遷移します。");
      router.push(`/login`);

    }
  };

  return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white shadow-md rounded-2xl p-8 w-full max-w-md">
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
            新しいパスワードを設定
          </h2>
          <form onSubmit={handleReset} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                新しいパスワード
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="新しいパスワード"
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gray-600 text-white font-semibold py-2 rounded-lg hover:bg-black transition duration-200"
            >
              更新
            </button>
          </form>
          {message && (
            <p className="mt-4 text-center text-sm text-green-600">{message}</p>
          )}
        </div>
      </div>
  );
}

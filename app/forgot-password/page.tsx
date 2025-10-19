"use client";

import { useState } from "react";
import { sendResetEmail } from "@/lib/auth/sendResetEmail";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await sendResetEmail(email);
    setMessage(res ? "パスワードリセット用のメールを送信しました" : "メール送信に失敗しました");
  };

  return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white shadow-md rounded-2xl p-8 w-full max-w-md">
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
            パスワードリセット
          </h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                登録メールアドレス
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="example@email.com"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gray-600 text-white font-semibold py-2 rounded-lg hover:bg-black transition duration-200"
            >
              送信
            </button>
          </form>
          {message && (
            <p className="mt-4 text-center text-sm text-green-600">{message}</p>
          )}
        </div>
      </div>
  );
}

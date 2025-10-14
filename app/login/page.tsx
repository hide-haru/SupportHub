"use strict";
"use client";

import '../styles/loginform.css';
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { supabase } from "@/lib/supabaseClient";

export default function Login() {

    const router = useRouter();

    const handleclick = async(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const userId = formData.get("userId") as string;
        const password = formData.get("password") as string;

        try{
            const response = await fetch("http://localhost:3000/api/auth/login",{
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({userId: userId, password: password})
            });
            const result = await response.json();
            const email = result.email;

            //JWTの発行
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password:password.toString(), // 念のため string 化
            });

            if(error) {
            console.error("ログイン失敗:", error.message);
            return null;
            }

            // JWT と Refresh Token が取得可能
            const jwt = data.session?.access_token;
            const refreshToken = data.session?.refresh_token;


            
            localStorage.getItem("accessToken");
            console.log("保存されたトークン:", localStorage.getItem("accessToken"));
            
            // 成功したらフルリロードでTasksへ
            window.location.href = "/tasks";
            //router.replace("/tasks?reload=" + Date.now());
        }catch(err){
            console.log("サーバとの通信に失敗しました。再度ログインをお願いします。")
        }
    };

    return (
        <>
            <div className='login-container'>
                <Link href="http://localhost:3000/signup">新規登録はこちら</Link>
                <h1>SupportHub</h1>
                <form onSubmit={handleclick}>
                    <dl>
                        <dt>ユーザID</dt>
                        <dd><input type="text" name="userId" placeholder="半角数字" onInput={(e) => {const target = e.target as HTMLInputElement; target.value = target.value.replace(/[^0-9]/g, "");}} required /></dd>
                        <dt>パスワード</dt>
                        <dd><input type="password" name="password" placeholder="パスワード" onInput={(e) => {const target = e.target as HTMLInputElement; target.value = target.value.replace(/[^0-9a-zA-Z]/g, "");}} required /></dd>
                        <button type="submit">ログイン</button>
                    </dl>
                </form>
                <Link href="http://localhost:3000/forgot-password">パスワードを忘れた方はこちら</Link>
            </div>
        </>
    );
}
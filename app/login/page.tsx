"use strict";
"use client";

import '../styles/loginform.css';
import Link from "next/link";

/*
課題
*/

export default function Login() {

    const handleclick = async(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const userId = formData.get("userId");
        const password = formData.get("password");

        try{
            const response = await fetch("http://localhost:3000/api/auth/login",{
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({userId: userId, password: password})
            });
            const result = await response.json();
            console.log(result);
        }catch(err){
            console.log("サーバとの通信に失敗しました。再度ログインをお願いします。")
        }
    };

    return (
        <>
            <div className='login-container'>
                <Link href="http://localhost:3000/signup">新規登録</Link>
                <h1>SupportHub</h1>
                <h2>ログイン</h2>
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
"use strict";
"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useParams,useRouter } from 'next/navigation';
import '../../styles/signupform.css';




export default function MyPage() {
    const router = useRouter();

    const [userName,setUserName] = useState<string>("");
    const [userId,setUserId] = useState<string>("");
    const [eMail,setEMail] = useState<string>("");
    const [password,setPassword] = useState("");

    const params = useParams();
    const id = params.id as string;
    console.log(id);
    
    useEffect(() => {
        const fetchData = async () => {
            try{

                const response = await fetch(`/api/mypage/${id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    },
                });

                const result = await response.json();
                setUserName(result.user_name);
                setUserId(result.user_id);
                setEMail(result.email)

            }catch(err){
                console.log(err);
                console.log("サーバとの通信に失敗しました。")
            }
        };

        fetchData();
    }, []);

    const handleclick = async(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const userName = formData.get("userName") as string;
        const userId = formData.get("userId") as string;
        const eMail = formData.get("eMail") as string;
        const password = formData.get("password") as string;

        try{
            const bodyData: any = {id, userName, userId, eMail};
            if (password && password.trim() !== "") {
                bodyData.password = password;
            }

            const response = await fetch(`/api/mypage/${id}`,{
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify(bodyData),
            });
            const result = await response.json();
            console.log(result);
            alert("/tasksへ遷移します。")
            router.push("/tasks");

        }catch(err){
            console.log("サーバとの通信に失敗しました。再度、新規登録をお願いします。")
        }
    };

    return (
        <>
            <div className='signup-container'>
                <h1>マイページ</h1>
                <form onSubmit={handleclick}>
                    <dl>
                        <dt>名前</dt>
                        <dd><input type="text" name="userName" value={userName} onChange={(e) => setUserName(e.target.value)} placeholder="名前" required /></dd>
                        <dt>ユーザID</dt>
                        <dd><input type="text" name="userId" value={userId} onChange={(e) => setUserId(e.target.value)} placeholder="半角数字" onInput={(e) => {const target = e.target as HTMLInputElement; target.value = target.value.replace(/[^0-9]/g, "");}} required /></dd>
                        <dt>メールアドレス</dt>
                        <dd><input type="email" name="eMail" value={eMail} onChange={(e) => setEMail(e.target.value)} placeholder="メールアドレス" required /></dd>
                        <dt>パスワード</dt>
                        <dd><input type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="パスワード（必須項目）" onInput={(e) => {const target = e.target as HTMLInputElement; target.value = target.value.replace(/[^0-9a-zA-Z]/g, "");}} required /></dd>
                        <button type="submit">変更する</button>
                    </dl>
                </form>
            </div>
        </>
    );
}
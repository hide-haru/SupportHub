"use strict";
"use client";

import '../styles/signupform.css';



export function SignUpForm() {

    const handleclick = async(e: React.FormEvent<HTMLFormElement>) => {

        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const userName = formData.get("userName");
        const userId = Number(formData.get("userId"));
        const eMail = formData.get("eMail");
        const password = formData.get("password");

        if (userId < 0 || userId > 2147483647) {
            alert("ユーザIDは1〜2147483647の範囲で入力してください");
            return;
        }

        try{
            const response = await fetch("/api/auth/signup",{
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({userName: userName, userId: userId, eMail: eMail, password: password})
            });
            const result = await response.json();
            alert(result.message);
        }catch(err){
            alert("サーバとの通信に失敗しました。再度、新規登録をお願いします。")
        }
    };

    return (
        <>
            <h1>新規登録</h1>
            <form onSubmit={handleclick}>
                <dl>
                    <dt>名前</dt>
                    <dd><input type="text" name="userName" placeholder="名前" required /></dd>
                    <dt>ユーザID</dt>
                    <dd><input type="text" name="userId" placeholder="半角数字" onInput={(e) => {const target = e.target as HTMLInputElement; target.value = target.value.replace(/[^0-9]/g, "");}} required /></dd>
                    <dt>メールアドレス</dt>
                    <dd><input type="email" name="eMail" placeholder="メールアドレス" required /></dd>
                    <dt>パスワード</dt>
                    <dd><input type="password" name="password" placeholder="パスワード" onInput={(e) => {const target = e.target as HTMLInputElement; target.value = target.value.replace(/[^0-9a-zA-Z]/g, "");}} required /></dd>
                    <button type="submit">新規登録</button>
                </dl>
            </form>
        </>
    );
}
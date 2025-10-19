"use strict";
"use client";

import '../styles/loginform.css';
import { LoginForm } from "./LoginForm";



export default function LoginPage() {

    return (
        <div className="login-container">
            <LoginForm />
        </div>
    );
}
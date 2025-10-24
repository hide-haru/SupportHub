"use strict";
"use client";

import "./layout.css"
import { LoginForm } from "./LoginForm";



export default function LoginPage() {

    return (
        <div className="login-container">
            <LoginForm />
        </div>
    );
}
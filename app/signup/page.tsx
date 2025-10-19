"use strict";
"use client";

import '../styles/signupform.css';
import { SignUpForm } from "./SignUpForm";



export default function SignUp() {

    return (
        <div className="signup-container">
            <SignUpForm />
        </div>
    );
}
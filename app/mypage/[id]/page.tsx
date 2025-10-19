"use strict";
"use client";

//import '../../styles/signupform.css';
import { MyPageForm } from "./MyPageForm";
import './layout.css';



export default function MyPagePage() {

    return (
        <div className="center-wrapper">
            <div className="mypage-container">
                <h1>マイページ</h1>
                <MyPageForm />
            </div>
        </div>
    );
}
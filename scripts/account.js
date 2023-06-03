import { auth } from "../scripts/firebase.js";
import { onAuthStateChanged,sendEmailVerification } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-auth.js";

onAuthStateChanged(auth, (user)=>{
    const userName = document.querySelector('.user-name');
    userName.textContent = user.displayName;

    const userVerified = document.querySelector('.user-verified');

    if (user.emailVerified == true) {
        userVerified.textContent = "驗證狀態：已通過";
    }else{
        userVerified.textContent = "驗證狀態：未通過（點此以發送驗證信）";
        userVerified.addEventListener("click", (e)=>{
            e.preventDefault();
            sendEmailVerification(user);
            alert("已發送驗證信！\n" + "請至 " + user.email + " 查看");
        })
    }
})
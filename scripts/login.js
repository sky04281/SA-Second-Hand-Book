import { auth } from "../scripts/firebase.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-auth.js";

const btn = document.getElementById("btn-login");
const email = document.getElementById("email");
const password = document.getElementById("password");

btn.addEventListener("click", () => {
    signInWithEmailAndPassword(auth, email.value, password.value)
    .then((userCredential) => {
        localStorage.setItem('userId', userCredential.user.uid);
        localStorage.setItem('userName', userCredential.user.displayName);
        localStorage.setItem('isVerified', userCredential.user.emailVerified);
        alert("登入成功! 點擊返回首頁");
        window.location.replace("./index.html");
    })
    .catch((error) => {
        const errorMessage = error.message;
        console.log(errorMessage);
        alert("登入失敗！請確認帳號密碼是否正確");
    });
});
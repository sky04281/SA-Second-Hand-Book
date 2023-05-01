import { auth } from "../scripts/firebase.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-auth.js";

const navbar = document.getElementById("nav-account");


onAuthStateChanged(auth, (user) => {
    if(user){
    console.log(user);
        navbar.innerHTML =  "<a href='account.html' class='nav-item nav-link'>帳號管理</a>"+
                            "<a href='#' class='nav-item nav-link' id='btn-logout'>登出</a>"+
                            "<a href='notify.html' class='nav-item nav-link'><i class='fas fa-bell text-primary'></i></a>";
        
        const btn = document.getElementById("btn-logout");
        btn.addEventListener("click", (e) => {
            e.preventDefault;
            signOut(auth);
            alert("登出成功!");
        });
    }else{
        navbar.innerHTML = "<a href='login.html' class='nav-item nav-link'>登入</a>"
        +"<a href='register.html' class='nav-item nav-link'>註冊</a>";
    }
});



import { auth } from "../scripts/firebase.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-auth.js";

// 導覽列
const myNav = document.querySelector('.myNav');
myNav.innerHTML = 
    "<nav class='navbar navbar-expand-lg bg-light navbar-light py-3 py-lg-0 px-0'>" +
        "<div class='collapse navbar-collapse justify-content-between' id='navbarCollapse'>" +
            "<div class='navbar-nav mr-auto py-0'>" +
                "<a href='index.html' class='nav-item nav-link active'>首頁</a>" +
                "<a href='shop.html' class='nav-item nav-link'>全部商品</a>" +
                "<a href='shop.html' class='nav-item nav-link'>求書專區</a>" +
            "</div>" +
            "<div class='myNav-account navbar-nav ml-auto py-0'>" +
            "</div>" +
        "</div>" +
    "</nav>";
const navAccount = myNav.querySelector('.myNav-account');

onAuthStateChanged(auth, (user) => {
    if(user){
    console.log(user);
        // 導覽列登入登出
        navAccount.innerHTML =  
            "<a href='account.html' class='nav-item nav-link'>帳號管理</a>"+
            "<a href='#' class='btn-logout nav-item nav-link'>登出</a>";
        
        const btn = navAccount.querySelector('.btn-logout');
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            signOut(auth)
            .then(() => {
                alert("登出成功!");
            });
        });
    }else{
        navAccount.innerHTML = 
            "<a href='login.html' class='nav-item nav-link'>登入</a>" +
            "<a href='register.html' class='nav-item nav-link'>註冊</a>";
    }
});

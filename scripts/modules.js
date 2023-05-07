import { auth, db } from "../scripts/firebase.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-firestore.js";

const myNav = document.querySelector('.myNav');

// 導覽列
{
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
}

const navAccount = myNav.querySelector('.myNav-account');
onAuthStateChanged(auth, async (user) => {
    if(user){
    console.log(user);
    const userRef = doc(db, "Account", user.uid);
    const userSnap = await getDoc(userRef);
    
    // 導覽列-登入中
    navAccount.innerHTML =  
        "<span class = 'nav-item nav-link'>您好 "+ userSnap.data().name +"</span>" + 
        "<a href='account.html' class='nav-item nav-link'>帳號管理</a>" +
        "<a href='#' class='btn-logout nav-item nav-link'>登出</a>" +
        "<a href='buyernotify.html' class='nav-item nav-link'><i class='fas fa-bell text-primary'></i></a>";
        
        const btn = navAccount.querySelector('.btn-logout');
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            signOut(auth)
            .then(() => {
                alert("登出成功! 即將返回首頁");
                location.href = "./index.html";
            });
        });
        
    }else{
        // 導覽列-未登入
        navAccount.innerHTML = 
            "<a href='login.html' class='nav-item nav-link'>登入</a>" +
            "<a href='register.html' class='nav-item nav-link'>註冊</a>";
    }
});

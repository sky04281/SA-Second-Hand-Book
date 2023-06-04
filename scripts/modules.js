import { auth, db } from "../scripts/firebase.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-firestore.js";

const myNav = document.querySelector('.myNav');
const myHeader = document.querySelector('.myHeader');
const myFooter = document.querySelector('.myFooter');
console.log(localStorage);
document.title = "到底書在哪==";

// 導覽列
if(myNav != null){
    myNav.innerHTML = 
        "<nav class='navbar navbar-expand-lg bg-light navbar-light py-3 py-lg-0 px-0'>" +
            "<div class='collapse navbar-collapse justify-content-between' id='navbarCollapse'>" +
                "<div class='navbar-nav mr-auto py-0'>" +
                    "<a href='index.html' class='nav-item nav-link'>首頁</a>" +
                    "<a href='shop.html' class='nav-item nav-link'>全部商品</a>" +
                    "<a href='wantedshop.html' class='nav-item nav-link'>求書專區</a>" +
                "</div>" +
                "<div class='myNav-account navbar-nav ml-auto py-0'>" +
                "</div>" +
            "</div>" +
        "</nav>";

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
                    localStorage.removeItem('userId');
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
}

//header
{
myHeader.innerHTML = 
    "<div class='row align-items-center py-3 px-xl-5'>" +
        "<div class='col-lg-3 d-none d-lg-block'>" +
            "<a href='index.html' class='text-decoration-none'>" +
                "<h3 class='m-0 display-5 font-weight-semi-bold'><i class='fas fa-bookmark text-primary'></i> 到底書在哪==" +
                "</h3>" +
            "</a>" +
        "</div>" +
        "<div class='col-lg-5 col-6 text-left'>" +
            "<form class='search-form'>" +
                "<div class='input-group'>" +
                    "<input type='text' class='search-input form-control' placeholder='尋找書籍' id='search-input'>" +
                    "<div class='input-group-append'>" +
                        "<span class='input-group-text bg-transparent text-primary'>" +
                            "<i class='search-btn fa fa-search'></i>" +
                        "</span>" +
                    "</div>" +
                "</div>" +
            "</form>" +
        "</div>" +
        "<div class='col-lg-4 col-6 text-right'>" +
            "<a href='chatroom.html' class='btn border'>" +
                "<i class='fas fa-comments text-primary'></i>" +
                "<span class='badge'>來聊聊</span>" +
            "</a>" +
            "<a href='addbook.html' class='btn border'>" +
                "<i class='fas fa-plus text-primary'></i>" +
                "<span class='badge'>要賣書</span>" +
            "</a>" +
            "<a href='wanted.html' class='btn border'>" +
                "<i class='fas fa-book text-primary'></i>" +
                "<span class='badge'>給我書</span>" +
            "</a>" +
        "</div>" +
    "</div>" ;
}

//footer
{
myFooter.innerHTML = 
        "<div class='row px-xl-5 pt-5'>" +
            "<div class='col-lg-4 col-md-12 mb-5 pr-3 pr-xl-5'>" +
                "<a href='' class='text-decoration-none'>" +
                    "<h1 class='mb-4 display-5 font-weight-semi-bold'><i class='fas fa-bookmark text-primary'></i> 到底書在哪==</h1>" +
                "</a>" +
                "<p>現今大學生在買賣二手書方面會遭遇更種困境，「到底書在哪==」製作團隊期望提供使用者一個全新的平台，創造更便捷的環境！</p>" +
            "</div>" +
            "<div class='col-lg-4 col-md-12'>" +
                "<p class='mb-2' style='font-size: 20px'>聯繫我們</p>" +
                "<p class='mb-2'><i class='fa fa-map-marker-alt text-primary mr-3'></i>242新北市新莊區中正路510號</p>" +
                "<p class='mb-2'><i class='fa fa-envelope text-primary mr-3'></i>bighandsomebrother@gmail.com</p>" +
                "<p class='mb-2'><i class='fa fa-phone-alt text-primary mr-3'></i>+886 0123456789</p>" +
            "</div>" +
            "<div class='col-lg-4 col-md-12'>" +
                "<div class='row'>" +
                    "<div class='col-md-4 mb-5' style='margin-left: 5%'>" +
                        "<div class='d-flex flex-column justify-content-start'>" +
                            "<a class='text-dark mb-2' href='index.html'><i class='fa fa-angle-right mr-2'></i>首頁</a>" +
                            "<a class='text-dark mb-2' href='shop.html'><i class='fa fa-angle-right mr-2'></i>全部商品</a>" +
                            "<a class='text-dark mb-2' href='detail.html'><i class='fa fa-angle-right mr-2'></i>來聊聊</a>" +
                            "<a class='text-dark mb-2' href='addbook.html'><i class='fa fa-angle-right mr-2'></i>要賣書</a>" +
                            "<a class='text-dark mb-2' href='wanted.html'><i class='fa fa-angle-right mr-2'></i>給我書</a>" +
                        "</div>" +
                    "</div>" +
                    
                "</div>" +
            "</div>" +
        "</div>" ;
}
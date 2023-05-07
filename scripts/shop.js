import { auth, db } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-auth.js";
import { collection, query, where, and, getDocs, getDoc, doc } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-firestore.js";


const ref = collection(db, "Product");
const view = document.querySelector('.viewbook');
const dropdown = document.querySelector('.dropdown-search');
const btn = document.querySelector('.btn-search');
const form = document.querySelector('.from-search');

let search = document.getElementById('input-search');
let cateKey = "";
let cateValue = "";
let q, querySnapshot;

//分類選單-渲染
{
dropdown.innerHTML = 
    "<div class='nav-item dropdown'>"+
        "<a href='#' class='nav-link' data-toggle='dropdown' name='area'>地區 <i"+
                "class='fa fa-angle-down float-right mt-1'></i></a>"+
        "<div class='dropdown-menu position-absolute bg-secondary border-0 rounded-0 w-100 m-0'>"+
            "<a href='' class='dropdown-item'>北北基</a>"+
            "<a href='' class='dropdown-item'>桃竹苗</a>"+
            "<a href='' class='dropdown-item'>中彰投</a>"+
            "<a href='' class='dropdown-item'>雲嘉南</a>"+
        "</div>"+
    "</div>"+
    "<div class='nav-item dropdown'>"+
        "<a href='#' class='nav-link' data-toggle='dropdown' name='school'>學校 <i"+
                "class='fa fa-angle-down float-right mt-1'></i></a>"+
        "<div class='dropdown-school dropdown-menu position-absolute bg-secondary border-0 rounded-0 w-100 m-0'>"+
        "</div>"+
    "</div>"+
    "<div class='nav-item dropdown'>"+
        "<a href='#' class='nav-link' data-toggle='dropdown' name='college'>學院 <i"+
                "class='fa fa-angle-down float-right mt-1'></i></a>"+
        "<div class='dropdown-college dropdown-menu position-absolute bg-secondary border-0 rounded-0 w-100 m-0'>"+
        "</div>"+
    "</div>"+
    "<div class='nav-item dropdown'>"+
        "<a href='#' class='nav-link' data-toggle='dropdown' name='department'>科系 <i"+
                "class='fa fa-angle-down float-right mt-1'></i></a>"+
        "<div class='dropdown-department dropdown-menu position-absolute bg-secondary border-0 rounded-0 w-100 m-0'>"+
        "</div>"+
    "</div>"+
    "<div class='nav-item dropdown'>"+
        "<a href='#' class='nav-link' data-toggle='dropdown' name='subject'>科目 <i"+
                "class='fa fa-angle-down float-right mt-1'></i></a>"+
        "<div class='dropdown-menu position-absolute bg-secondary border-0 rounded-0 w-100 m-0'>"+
            "<a href='' class='dropdown-item'>會計</a>"+
        "</div>"+
    "</div>";
}

//分類選單-功能
{
const totalRef = doc(db, "Account", "Account_Total");
const totalSnap = await getDoc(totalRef);
const tschool = totalSnap.data().tschool; 
const tcollege = totalSnap.data().tcollege; 
const tdepartment = totalSnap.data().tdepartment;

//抓取已有的學校、學院、科系，並且渲染出來
tschool.forEach((s) =>{
    document.querySelector('.dropdown-school').innerHTML += 
        ("<a href='' class='dropdown-item'>" + s + "</a>");
});
tcollege.forEach((c) =>{
    document.querySelector('.dropdown-college').innerHTML += 
        ("<a href='' class='dropdown-item'>" + c + "</a>");
});
tdepartment.forEach((d) =>{
    document.querySelector('.dropdown-department').innerHTML += 
        ("<a href='' class='dropdown-item'>" + d + "</a>");
});

//點擊分類按鈕
const navLink = document.querySelectorAll('.nav-link');
navLink.forEach((link) => {
    link.addEventListener("click", () =>{
        cateKey = link.textContent;
        console.log(cateKey);
    });
});    
const dropdownItem = document.querySelectorAll('.dropdown-item');
dropdownItem.forEach((item) => {
    item.addEventListener("click", (e) => {
        e.preventDefault();
        cateValue = item.textContent;
        console.log(cateValue);
        myQuery();
    });
});
}

//搜尋欄
{
btn.addEventListener("click", async (e) => {
    e.preventDefault();
    myQuery();
});

form.addEventListener("submit", async (e)=>{
    e.preventDefault();
    myQuery();
});
}

querySnapshot = await getDocs(ref);
show();

//書籍渲染
function show(){
    //排序按鈕
    view.innerHTML = 
        "<div class='col-12 pb-1'>" +
            "<div class='d-flex align-items-center justify-content-between mb-4'>" +
                "<form action=''>" +
                    "<a href='shop.html'>全部商品</a> >" + cateKey + ">" + cateValue +
                "</form>" +
                "<div class='dropdown ml-4'>" +
                    "<button class='btn border dropdown-toggle' type='button' id='triggerId'"  +
                        "data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>" +
                                "排序" +
                    "</button>" +
                "<div class='dropdown-menu dropdown-menu-right' aria-labelledby='triggerId'>" +
                        "<a class='dropdown-item' href='#'>上架日期由近至遠</a>" +
                        "<a class='dropdown-item' href='#'>上架日期由遠至近</a>" +
                        "<a class='dropdown-item' href='#'>價格由高至低</a>" +
                        "<a class='dropdown-item' href='#'>價格由低至高</a>" +
                    "</div>" +
                "</div>" +
            "</div>" +
        "</div>";
    
    //書籍
    querySnapshot.forEach( (docs) => {
        view.innerHTML = view.innerHTML +
            "<div class='col-lg-4 col-md-6 col-sm-12 pb-1'>"+
                "<div class='card product-item border-0 mb-4'>"+
                    "<div class='card-header product-img position-relative overflow-hidden bg-transparent border p-0'>"+
                        "<a href='buyingbook.html' title=''><img src='img/product-2.jpg' class='img-fluid w-100' alt=''></a>"+
                    "</div>"+
                    "<div class='card-body border-left border-right text-center p-0 pt-4 pb-3'>"+
                        "<a href='buyingbook.html' class='active'><h6 class='text-truncate mb-3'>"+ docs.data().book +"</h6></a>"+
                        "<div class='d-flex justify-content-center'>"+
                            "<h6>" + "NT$" + docs.data().price + "</h6>"+
                        "</div>"+
                    "</div>"+
                "</div>"+
            "</div>";
        
    });

    //分頁按鈕
    view.innerHTML = view.innerHTML +
    "<div class='col-12 pb-1'>"+
        "<nav aria-label='Page navigation'>"+
            "<ul class='pagination justify-content-center mb-3'>"+
                "<li class='page-item disabled'>"+
                    "<a class='page-link' href='#' aria-label='Previous'>"+
                        "<span aria-hidden='true'>&laquo;</span>"+
                        "<span class='sr-only'>Previous</span>"+
                    "</a>"+
                "</li>"+
                "<li class='page-item active'><a class='page-link' href='#'>1</a></li>"+
                "<li class='page-item'><a class='page-link' href='#'>2</a></li>"+
                "<li class='page-item'><a class='page-link' href='#'>3</a></li>"+
                "<li class='page-item'>"+
                    "<a class='page-link' href='#' aria-label='Next'>"+
                        "<span aria-hidden='true'>&raquo;</span>"+
                        "<span class='sr-only'>Next</span>"+
                    "</a>"+
                "</li>"+
            "</ul>"+
        "</nav>"+
    "</div>";

    search.value = "";
}

//查詢功能
async function myQuery(){
    //有選分類
    if((search.value == "") && (cateKey != "")){
        console.log("123");
        q = query(ref, where("category", "array-contains", cateValue));
        querySnapshot = await getDocs(q);
    }
    else if((search.value != "") && (cateKey != "")){
        console.log("456");
        q = query(ref, where("category", "array-contains", cateValue), where("book", "==", search.value));
        querySnapshot = await getDocs(q);
    }
    //沒選分類
    else if (search.value == "") {
        querySnapshot = await getDocs(ref);
    }
    else{
        q = query(ref, where("book", "==", search.value));
        querySnapshot = await getDocs(q);
    }
    show();
    search.value = "";
}


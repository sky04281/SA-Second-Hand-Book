import { auth, db } from "../scripts/firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-auth.js";
import { collection, query, where, and, getDocs, getDoc, doc, orderBy, startAt, endAt } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-firestore.js";

const delivery = document.getElementById("delivery");
const address = document.getElementById("address");
const payment = document.getElementById("payment");
const others = document.getElementById("others");
const btn = document.getElementById("btn-order");
var date = new Date(); 

//接值
const order = document.querySelector('.order');

let myUrl = new URL(window.location.href);
let bookId = myUrl.searchParams.get('bookId');
console.log(bookId);

let bookRef = doc(db, "Product", bookId);
let bookSnap = await getDoc(bookRef);
console.log(bookSnap.data());

const colRef = doc(db, "Product", bookId);

show();

//書籍渲染
function show(){
        order.innerHTML = order.innerHTML +
            "<h5>書籍名稱：<font color='gray'>"+bookSnap.data().book+"</font><br>" +
                "作者：<font color='gray'>"+bookSnap.data().author+"</font><br>"+
                "出版社：<font color='gray'>"+bookSnap.data().publish+"</font><br>"+
                "國際書號：<font color='gray'>"+bookSnap.data().isbn+"</font><br>"+
                "書籍價格：<font color='gray'>$"+bookSnap.data().price+"</font><br>"+
            "</h5>"+
            "<br>"
}

onAuthStateChanged(auth, (user) =>{
    if(user){
        console.log(user);
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            updateDoc(colRef, {
                buyerId: user.uid,
                order: [delivery.value, address.value, payment.value, others.value, true], 
                ordering: "待賣家確認"
            })
            .then(() => {
                alert("訂單已傳送給賣家!")
                location.href = "./shop.html";
            });
        });

    }else{
        alert("請先登入!");
        location.href = "./login.html";
    }   
});
import { auth, db, storage } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-auth.js";
import { collection, query, where, and, getDocs, getDoc, doc, orderBy, startAt, endAt, updateDoc } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-firestore.js";
import { ref, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-storage.js";

const delivery = document.getElementById("delivery");
const address = document.getElementById("address");
const payment = document.getElementById("payment");
const others = document.getElementById("others");
const btn = document.getElementById("btn-order");
var date = new Date(); 
var deadline = new Date();

//接值
const bookinform = document.querySelector('.bookinform');
const selectdel = document.querySelector('.delivery');
const selectpay = document.querySelector('.payment');

let myUrl = new URL(window.location.href);
let bookId = myUrl.searchParams.get('bookId');
console.log(bookId);

let bookRef = doc(db, "Wanted", "2muHEzc2hdRtAYWLWwLJ");
let bookSnap = await getDoc(bookRef);
console.log(bookSnap.data());

show();
const imgRef = ref(storage, bookSnap.data().imgsrc);
getDownloadURL(imgRef).then((url)=>{
    var img = document.getElementById('book-img');
    img.setAttribute('src', url);
});

//書籍渲染
function show(){
    bookinform.innerHTML = bookinform.innerHTML +
            "<h5>書籍名稱：<font color='gray'>"+bookSnap.data().book+"</font><br>" +
                "作者：<font color='gray'>"+bookSnap.data().author+"</font><br>"+
                "出版社：<font color='gray'>"+bookSnap.data().publish+"</font><br>"+
                "國際書號：<font color='gray'>"+bookSnap.data().isbn+"</font><br>"+
                "書籍價格：<font color='gray'>$"+bookSnap.data().price+"</font><br>"+
            "</h5>"

    selectdel.innerHTML = selectdel.innerHTML +
            "<option value=''>寄送方式</option>" +
            "<option value='" + bookSnap.data().delivery[0] + "'>" + bookSnap.data().delivery[0] + "</option>" +
            "<option value='" + bookSnap.data().delivery[1] + "'>" + bookSnap.data().delivery[1] + "</option>" +
            "<option value='" + bookSnap.data().delivery[2] + "'>" + bookSnap.data().delivery[2] + "</option>" +
            "<option value='" + bookSnap.data().delivery[3] + "'>" + bookSnap.data().delivery[3] + "</option>" 

    selectpay.innerHTML = selectpay.innerHTML +
            "<option value=''>付款方式</option>" +
            "<option value='" + bookSnap.data().pay[0] + "'>" + bookSnap.data().pay[0] + "</option>" +
            "<option value='" + bookSnap.data().pay[1] + "'>" + bookSnap.data().pay[1] + "</option>" +
            "<option value='" + bookSnap.data().pay[2] + "'>" + bookSnap.data().pay[2] + "</option>"
}

onAuthStateChanged(auth, (user) =>{
    if(user){
        //已通過身分驗證
        if(user.emailVerified == true){
            btn.addEventListener("click", (e) => {
                e.preventDefault();
                updateDoc(colRef, {
                    buyerId: user.uid,
                    order: [delivery.value, address.value, payment.value, others.value, true], 
                    ordering: "待賣家確認",
                    setuptime: date,
                    deadline: deadline.setDate(date.getDate()+7)
                })
                .then(() => {
                    alert("訂單已傳送給賣家!")
                    location.href = "./shop.html";
                });
            });

        //假如未驗證
        }else{
            alert("請先通過身分驗證！");
            location.href = "./account.html";
        }
    }else{
        alert("請先登入!");
        location.href = "./login.html";
    }   
});
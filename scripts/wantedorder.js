import { auth, db, storage } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-auth.js";
import { collection, query, where, and, getDocs, getDoc, doc, orderBy, startAt, endAt, updateDoc } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-firestore.js";
import { ref, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-storage.js";

const delivery = document.getElementById("delivery");
const payment = document.getElementById("payment");
const price = document.getElementById("price");
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

let bookRef = doc(db, "Wanted", bookId);
let bookSnap = await getDoc(bookRef);
console.log(bookSnap.data());

const colRef = doc(db, "Wanted", bookId);

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
                "買家預期價格：<font color='gray'>$"+bookSnap.data().price+"</font><br>"+
            "</h5>"
}

onAuthStateChanged(auth, (user) =>{
    if(user){
        
        for(let i=0;i<4;i++){
            if(bookSnap.data().delivery[i]!=""){
                selectdel.innerHTML = selectdel.innerHTML +
                    "<option value='" + bookSnap.data().delivery[i] + "'>" + bookSnap.data().delivery[i] + "</option>"
            }
            else{
                continue;
            }
        }

        for(let i=0;i<3;i++){
            if(bookSnap.data().pay[i]!=""){
                selectpay.innerHTML = selectpay.innerHTML +
                    "<option value='" + bookSnap.data().pay[i] + "'>" + bookSnap.data().pay[i] + "</option>"
            }
            else{
                continue;
            }
        }
        
        //已通過身分驗證
        if(user.emailVerified == true){
            btn.addEventListener("click", (e) => {
                e.preventDefault();
                updateDoc(colRef, {
                    sellerId: user.uid,
                    order: [delivery.value, "",price.value, payment.value, others.value, true], 
                    //賣家接受的資訊:運送方式, 地址(買家填寫), 賣家出價, 支付方式, 備註, 訂單判斷
                    ordering: "待買家接受訂單",
                })
                .then(() => {
                    alert("訂單已傳送給買家!")
                    location.href = "./wantedshop.html";
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
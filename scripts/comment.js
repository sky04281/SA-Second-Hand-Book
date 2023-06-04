import { auth, db, storage } from "../scripts/firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-auth.js";
import { collection, query, where, and, getDocs, getDoc, doc, orderBy, startAt, endAt, updateDoc, Timestamp, addDoc } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-firestore.js";
import { ref, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-storage.js";

const others = document.getElementById("others");
const btn = document.getElementById("btn-order");

//接值
const bookinform = document.querySelector('.bookinform');

let myUrl = new URL(window.location.href);
let bookId = myUrl.searchParams.get('bookId');
console.log(bookId);

let bookRef = doc(db, "Product", bookId);
let bookSnap = await getDoc(bookRef);
console.log(bookSnap.data());

const sellerRef = doc(db, "Account", bookSnap.data().sellerId);
const sellerSnap = await getDoc(sellerRef);
const buyerRef = doc(db, "Account", bookSnap.data().buyerId);
const buyerSnap = await getDoc(buyerRef);

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
                "賣家資訊：<font color='gray'>"+sellerSnap.data().name+"</font><br>"+
                "買家資訊：<font color='gray'>"+buyerSnap.data().name+"</font><br>"+
            "</h5>"
}

onAuthStateChanged(auth, (user) =>{
    if(user){
        
        if(user.uid==bookSnap.data().sellerId){
            btn.addEventListener("click", (e) => {
                e.preventDefault();
                
                let reasonchecked = document.querySelectorAll('input[name="checkbox"]:checked');
                let reasonoutput = [];
                reasonchecked.forEach((checkbox) => {
                    reasonoutput.push(checkbox.value);
                });

                while(reasonoutput.length<5){
                    reasonoutput.push("");
                }

                const colRef = collection(db, "Report");
                addDoc(colRef, {
                    product: bookId,
                    prosecutor: bookSnap.data().sellerId,
                    //原告
                    defendant: bookSnap.data().buyerId,
                    //被告
                    others: others.value,
                    reason: reasonoutput
                })
                .then(() => {
                    alert("檢舉已送出!")
                    location.href = "./sellernotify.html";
                });
            });

        }else{
            btn.addEventListener("click", (e) => {
                e.preventDefault();

                let reasonchecked = document.querySelectorAll('input[name="checkbox"]:checked');
                let reasonoutput = [];
                reasonchecked.forEach((checkbox) => {
                    reasonoutput.push(checkbox.value);
                });

                while(reasonoutput.length<5){
                    reasonoutput.push("");
                }

                const colRef = doc(db, "Report");
                addDoc(colRef, {
                    product: bookId,
                    defendant: bookSnap.data().sellerId,
                    prosecutor: bookSnap.data().buyerId,
                    others: others.value
                })
                .then(() => {
                    alert("檢舉已送出!")
                    location.href = "./buyernotify.html";
                });
            });
        }
    }else{
        alert("請先登入!");
        location.href = "./login.html";
    }   
});
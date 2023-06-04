import { auth, db, storage } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-auth.js";
import { collection, query, where, and, getDocs, getDoc, doc, orderBy, startAt, endAt, updateDoc, Timestamp, addDoc, setDoc } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-firestore.js";
import { ref, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-storage.js";

const address = document.getElementById("address");
const others = document.getElementById("others");
const btn = document.getElementById("btn-order");
var date = new Date(); 

//接值
const bookinform = document.querySelector('.bookinform');

let myUrl = new URL(window.location.href);
let bookId = myUrl.searchParams.get('bookId');
console.log(bookId);

let bookRef = doc(db, "Wanted", bookId);
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
                "<br>賣家出價價格：<font color='gray'>$"+bookSnap.data().order[2]+"</font><br>"+
                "寄送方式：<font color='gray'>"+bookSnap.data().order[0]+"</font><br>"+
                "付款方式：<font color='gray'>"+bookSnap.data().order[3]+"</font><br>"+
                "賣家備註：<font color='gray'>"+bookSnap.data().order[4]+"</font><br>"+
            "</h5>"
}

onAuthStateChanged(auth, (user) =>{
    if(user){
        //已通過身分驗證
        if(user.emailVerified == true){
            btn.addEventListener("click", (e) => {
                e.preventDefault();

                const colRef = doc(db, "Product", bookId);
                const deadline = Timestamp.fromMillis(date.setDate(date.getDate()+7));
                setDoc(colRef, {
                    book: bookSnap.data().book,
                    author: bookSnap.data().author,
                    publish: bookSnap.data().publish,
                    isbn: bookSnap.data().isbn,
                    price: parseInt(bookSnap.data().order[2]),
                    category: [bookSnap.data().category[0], bookSnap.data().category[1], bookSnap.data().category[2], bookSnap.data().category[3], bookSnap.data().category[4]],
                    // [0: 地區, 1: 學校, 2: 學院, 3: 科系, 4: 科目]
                    info: bookSnap.data().order[4],
                    sellerId: bookSnap.data().sellerId,
                    buyerId: bookSnap.data().buyerId,
                    date: date,
                    order: [bookSnap.data().order[0], address.value, bookSnap.data().order[2], others.value, true], 
                    ordering: "待賣家確認",
                    setuptime: date,
                    deadline: deadline,
                    imgsrc: bookSnap.data().imgsrc
                })
                updateDoc(bookRef, {
                    ordering: "訂單成立，請至訂單追蹤查看", 
                    order: [bookSnap.data().order[0], bookSnap.data().order[1], bookSnap.data().order[2], bookSnap.data().order[3], bookSnap.data().order[4], false]
                })
                .then(() => {
                    alert("訂單資訊已傳送給賣家!")
                    location.href = "./wantedshop.html";
                });
            });

            if(date==deadline){
                updateDoc(colRef, {
                    sellerId: "",
                    order: ["", "", "", "", ""], 
                    ordering: "",
                    setuptime: "",
                    deadline: ""
                })
                .then(() => {
                    alert("訂單已超時，將自動刪除!")
                    location.href = "./shop.html";
                });
            }

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
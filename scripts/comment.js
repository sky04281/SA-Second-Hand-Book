import { auth, db, storage } from "../scripts/firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-auth.js";
import { collection, query, where, and, getDocs, getDoc, doc, orderBy, startAt, endAt, updateDoc, Timestamp, addDoc } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-firestore.js";
import { ref, getDownloadURL, uploadBytes } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-storage.js";

const others = document.getElementById("others");
const btn = document.getElementById("btn-order");
let imgSrc = "Report/";

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
/*
const imgRef = ref(storage, bookSnap.data().imgsrc);
getDownloadURL(imgRef).then((url)=>{
    var img = document.getElementById('book-img');
    img.setAttribute('src', url);
});
*/
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
            btn.addEventListener("click", async (e) => {
                e.preventDefault();

                //存圖片
                if (imgFile) {
                    const imgRef = ref(storage, imgSrc);
                    uploadBytes(imgRef, imgFile);
                }else{
                    imgSrc = "Product/NotFound.jpg";
                }
                
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
                    imgsrc: imgSrc,
                    reason: reasonoutput
                })
                const scoreRef = doc(db, "Account", bookSnap.data().buyerId);
                const scoreSnap = await getDoc(scoreRef);
                updateDoc(scoreRef, {
                    score: scoreSnap.data().score-3
                })
                updateDoc(bookRef, {
                    ordering: "已完成評價"
                })
                .then(async () => {
                    alert("檢舉已送出!")
                    location.href = "./sellernotify.html";
                });
            });

        }else{
            btn.addEventListener("click",async (e) => {
                e.preventDefault();

                //存圖片
                if (imgFile) {
                    const imgRef = ref(storage, imgSrc);
                    uploadBytes(imgRef, imgFile);
                }else{
                    imgSrc = "Product/NotFound.jpg";
                }

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
                    imgsrc: imgSrc,
                    others: others.value,
                    reason: reasonoutput
                })
                const scoreRef = doc(db, "Account", bookSnap.data().sellerId);
                const scoreSnap = await getDoc(scoreRef);
                updateDoc(scoreRef, {
                    score: scoreSnap.data().score-3
                })
                updateDoc(bookRef, {
                    ordering: "買家已完成評價"
                })
                .then(async () => {
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

//上傳照片
const upload = document.getElementById('upload');
const img = document.getElementById('img-img');
const imginput = document.getElementById('img-input');
const imgbtn = document.getElementById("img-btn");
let imgFile;

upload.addEventListener("dragenter", dragenter, false);
upload.addEventListener("dragover", dragover, false);
upload.addEventListener("drop", drop, false);
imgbtn.addEventListener("click", click, false);
img.addEventListener("click", click, false);
imginput.addEventListener("change", 
    function onchange(e) {
        e.preventDefault();
        e.stopPropagation();
        handleFiles(this.files);
    }, false);

function dragenter(e){
    e.stopPropagation();
    e.preventDefault();
}

function dragover(e){
    e.stopPropagation();
    e.preventDefault();
}

function drop(e){
    e.stopPropagation();
    e.preventDefault();

    const dt = e.dataTransfer;
    const files = dt.files;
    handleFiles(files);
}

function click(e){
    e.stopPropagation();
    e.preventDefault();
    imginput.click();
}

function handleFiles(files){
    imgFile = files[0];
    const reader = new FileReader();
    reader.onload = function (e) {
        img.src = e.target.result;
    }
    reader.readAsDataURL(imgFile);
    img.style.display = 'block';
    imgbtn.style.display = 'none';
    upload.style.padding = '5%';
    imgSrc += imgFile.name;
}
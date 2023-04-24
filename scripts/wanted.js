import { auth, db } from "../scripts/firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-auth.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-firestore.js";

//接值
const book = document.getElementById("book");
const author = document.getElementById("author");
const publish = document.getElementById("publish");
const isbn = document.getElementById("isbn");
const cate = document.getElementById("cate");
const info = document.getElementById("info");
const btn = document.getElementById("btn-wanted");
var date = new Date(); 

const colRef = collection(db, "Wanted");

//如果登入再上架
onAuthStateChanged(auth, (user) =>{
    if(user){
        console.log(user);
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            addDoc(colRef, {
                book: book.value,
                author: author.value,
                publish: publish.value,
                isbn: isbn.value,
                cate: cate.value,
                category: [],
                info: info.value,
                sellerId: "",
                buyerId: user.uid,
                date: date.toLocaleDateString(),
                deadline: "",
                delivery: ""
            })
            .then(() => {
                alert("新增成功!");
                location.href = "./index.html";
            });
        });

    }else{
        alert("請先登入!");
        location.href = "./login.html";
    }   
});
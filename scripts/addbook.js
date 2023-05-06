import { auth, db } from "../scripts/firebase.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-auth.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-firestore.js";

//接值
const book = document.getElementById("book");
const author = document.getElementById("author");
const publish = document.getElementById("publish");
const isbn = document.getElementById("isbn");
const price = document.getElementById("price");
const cate = document.getElementById("cate");
const info = document.getElementById("info");
const btn = document.getElementById("btn-addbook");
var date = new Date(); 

const colRef = collection(db, "Product");

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
                price: price.value,
                cate: cate.value,
                category: [],
                info: info.value,
                sellerId: user.uid,
                buyerId: "",
                date: date.toLocaleDateString(),
                deadline: "",
                order: []
            })
            .then(() => {
                alert("新增成功!")
                location.href = "./index.html";
            });
        });

    }else{
        alert("請先登入!");
        location.href = "./login.html";
    }   
});
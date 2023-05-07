import { auth, db } from "../scripts/firebase.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-auth.js";
import { collection, addDoc, doc, getDoc } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-firestore.js";

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
onAuthStateChanged(auth, async (user) => {
    if (user) {
        console.log(user);
        const userRef = doc(db, "Account", user.uid);
        const userSnap = await getDoc(userRef);
        const data = userSnap.data();


        btn.addEventListener("click", (e) => {
            e.preventDefault();
            addDoc(colRef, {
                book: book.value,
                author: author.value,
                publish: publish.value,
                isbn: isbn.value,
                price: parseInt(price.value),
                cate: cate.value,
                category: [data.area, data.school, data.college, data.department],
                // [0: 地區, 1: 學校, 2: 學院, 3: 科系]
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

    } else {
        alert("請先登入!");
        location.href = "./login.html";
    }
});
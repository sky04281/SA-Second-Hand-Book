import { auth, db } from "../scripts/firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-auth.js";
import { doc, updateDoc } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-firestore.js";

const delivery = document.getElementById("delivery");
const address = document.getElementById("address");
const payment = document.getElementById("payment");
const others = document.getElementById("others");
const btn = document.getElementById("btn-order");
var date = new Date(); 

const colRef = doc(db, "Product", "ayR4rRGvunlDOkjYA1dC");

onAuthStateChanged(auth, (user) =>{
    if(user){
        console.log(user);
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            updateDoc(colRef, {
                buyerId: user.uid,
                order: [delivery.value, address.value, payment.value, others.value]
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
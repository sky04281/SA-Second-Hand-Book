import { auth, db, storage } from "../scripts/firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-auth.js";
import { collection, query, where, and, getDocs, getDoc, doc, orderBy, startAt, endAt, updateDoc } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-firestore.js";

let myUrl = new URL(window.location.href);
let bookId = myUrl.searchParams.get('bookId');

const bookRef = doc(db, "Product", bookId);
const bookSnap = await getDoc(bookRef);
const sellerId = bookSnap.data().sellerId;

onAuthStateChanged(auth, (user)=>{
    if (user) {
        const buyerId = user.uid;
        console.log("sellerId:", sellerId, "buyerId: ", buyerId);
    }else{
        alert("請先登入!");
        location.href = "./login.html";
    }
});



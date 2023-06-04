import { auth, db, storage } from "./firebase.js";
import { collection, query, where, and, getDocs, getDoc, doc, orderBy, startAt, endAt } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-firestore.js";
import { ref, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-storage.js";

//被檢舉買/賣家的書籍
const inform = document.querySelector('.inform');
console.log(inform)

let myUrl = new URL(window.location.href);
let bookId = myUrl.searchParams.get('bookId');
console.log(bookId);

let bookRef = doc(db, "Product", bookId);
let bookinform = await getDoc(bookRef);
console.log(bookinform.data().book);
// 接到值了 bookSnap.data().book 是書名，以此類推

show();

function show(){
    inform.innerHTML += bookinform.data().book;

}
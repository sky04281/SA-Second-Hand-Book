import { auth, db } from "../scripts/firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-auth.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-firestore.js";

const delivery = document.getElementById("delivery");
const address = document.getElementById("address");
const payment = document.getElementById("payment");
const others = document.getElementById("others");
const btn = document.getElementById("btn-order");
var date = new Date(); 


const colRef = collection(db, "Product", uid);
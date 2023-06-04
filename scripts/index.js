import { auth } from "../scripts/firebase.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-auth.js";

const btn = document.querySelector('.search-btn');
const form = document.querySelector('.search-form');
let search = document.getElementById('search-input');

btn.addEventListener("click", async (e) => {
    e.preventDefault();
    e.stopPropagation();
    window.location.href="shop.html?search=" + search.value;
});

form.addEventListener("submit", async (e)=>{
    e.preventDefault();
    e.stopImmediatePropagation();
    window.location.href="shop.html?search=" + search.value;
});
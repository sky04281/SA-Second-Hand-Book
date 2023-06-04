import { auth } from "../scripts/firebase.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-auth.js";

const form = document.querySelector('.search-form');

form.innerHTML =
    "<div class='input-group'>" +
        "<input type='text' class='search-input form-control' placeholder='尋找書籍' id='search-input'>" +
        "<div class='input-group-append'>" +
            "<span class='input-group-text bg-transparent text-primary'>" +
                "<i class='search-btn fa fa-search'></i>" +
            "</span>" +
        "</div>" +
    "</div>";


const btn = document.querySelector('.search-btn');
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
import { auth } from "../scripts/firebase.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-auth.js";
        
onAuthStateChanged(auth, (user) => {
    console.log(user);
});

// const logOutBtn = document.getElementById("btn-logout");
// logOutBtn.addEventListener("click", (e) => {
//     e.preventDefault;
//     signOut(auth);
//     alert("登出成功!");
// })
import { db } from "./firebase.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-firestore.js";

const submitBtn = document.getElementById("btn-submit");
const email = document.getElementById("email");
const name = document.getElementById("name");
const uid = document.getElementById("uid");
const school = document.getElementById("school");

submitBtn.addEventListener("click", (e) =>{
    e.preventDefault;
    try {
        const docRef = addDoc(collection(db, "Account"), {
            email: email.value,
            name : name.value,
            uid : uid.value,
            school : school.value 
        });
        console.log("Document written with ID: ", docRef.id);
    } catch (e) {
        console.error("Error adding document: ", e);
    }
});

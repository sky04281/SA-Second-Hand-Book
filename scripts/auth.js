import { app } from "./firebase.js";
import { getAuth, 
        createUserWithEmailAndPassword, 
        signInWithEmailAndPassword,
        signOut, 
        onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-auth.js";

const auth = getAuth(app);

function register(email, password){
    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;

    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // ..
    });
}

function logIn(email, password){
    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        const user = userCredential.user;

    })
    .catch((error) => {
        const errorMessage = error.message;
        console.log(errorMessage);
    });
}

function logOut(){
    signOut(auth).then(() => {
        // Sign-out successful.
    }).catch((error) => {
        console.log(errorMessage);
    });
}

function getUser(){
    let cuser;
    onAuthStateChanged(auth, (user) => {
        cuser = user;
        console.log(cuser);

    });
}

export {register, logIn, logOut, getUser};
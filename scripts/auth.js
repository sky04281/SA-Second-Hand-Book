import { app } from "./firebase.js";
import { getAuth, 
        createUserWithEmailAndPassword, 
        signInWithEmailAndPassword,
        signOut, 
        onAuthStateChanged } from "firebase/auth";

const auth = getAuth(app);

function register(email, password){
    createUserWithEmailAndPassword(auth, email, password)
    .then(() => {
        return "註冊成功";
    })
    .catch((error) => {
        const errorMessage = error.message;
        return errorMessage;
    });
}

function login(email, password){
    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        const user = userCredential.user;
        return user;
    })
    .catch((error) => {
        const errorMessage = error.message;
        console.log(errorMessage);
    });
}

function signout(){
    signOut(auth).then(() => {
        // Sign-out successful.
    }).catch((error) => {
        console.log(errorMessage);
    });
}

function getUser(){
    const user = auth.currentUser;
    if(user){
        return user;
    }else{
        return false;
    }
}
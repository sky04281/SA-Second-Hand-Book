import { initializeApp } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-storage.js";

const firebaseConfig = {
    apiKey: "AIzaSyB44Av5SScdqcEMoWlndNIOU7AZBEtiO20",
    authDomain: "sa-second-hand-book.firebaseapp.com",
    projectId: "sa-second-hand-book",
    storageBucket: "sa-second-hand-book.appspot.com",
    messagingSenderId: "771549250706",
    appId: "1:771549250706:web:cca9e01eee57662026d24b",
    storageBucket: "gs://sa-second-hand-book.appspot.com/"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
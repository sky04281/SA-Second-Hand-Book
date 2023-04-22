import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";


const firebaseConfig = {
    apiKey: "AIzaSyB44Av5SScdqcEMoWlndNIOU7AZBEtiO20",
    authDomain: "sa-second-hand-book.firebaseapp.com",
    projectId: "sa-second-hand-book",
    storageBucket: "sa-second-hand-book.appspot.com",
    messagingSenderId: "771549250706",
    appId: "1:771549250706:web:cca9e01eee57662026d24b"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export default {app, auth};
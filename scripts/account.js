import { auth,db } from "../scripts/firebase.js";
import { onAuthStateChanged,sendEmailVerification } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-auth.js";
import {  getDocs, getDoc, doc} from "https://www.gstatic.com/firebasejs/9.20.0/firebase-firestore.js";


onAuthStateChanged(auth,async (user)=>{
    const userName = document.querySelector('.user-name');
    userName.textContent = user.displayName;

    const userVerified = document.querySelector('.user-verified');
    

    if (user.emailVerified == true) {
        userVerified.textContent = "驗證狀態：已通過";
        
    }else{
        userVerified.textContent = "驗證狀態：未通過（點此以發送驗證信）";
        userVerified.addEventListener("click", (e)=>{
            e.preventDefault();
            sendEmailVerification(user);
            alert("已發送驗證信！\n" + "請至 " + user.email + " 查看");
        })
    }
    const scoreRef = doc(db, "Account", user.uid);
    const scoreSnap = await getDoc(scoreRef);

    const userScore = document.querySelector('.user-score');
    const userScoreSign = document.querySelector('.user-scoresign');
    userScore.textContent = "用戶信用分數: " +　scoreSnap.data().score;
    if(scoreSnap.data().score<=1){
        userScoreSign.textContent = "WARNING! 分數過低，再有不良交易行為則停用帳號！";
    }else if(scoreSnap.data().score==10){
        userScoreSign.textContent = "您為本平台優良用戶，請繼續保持！";
    }

    
})






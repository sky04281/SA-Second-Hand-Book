import { auth, db, storage } from "../scripts/firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-auth.js";
import { query, where, and, getDocs, getDoc, doc, updateDoc, setDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-firestore.js";


let myUrl = new URL(window.location.href);
let bookId = myUrl.searchParams.get('bookId');

const bookRef = doc(db, "Product", bookId);
const bookSnap = await getDoc(bookRef);
const sellerId = bookSnap.data().sellerId;

const chatInput = document.querySelector('.chat-input');
const chatText = document.querySelector('.chat-text');


let chatRef, chatSnap;
let chat = [];
onAuthStateChanged(auth, async (user)=>{
    if (user) {
        const buyerId = user.uid;
        chatRef = doc(db, "Chatroom", sellerId+buyerId);
        await setDoc(chatRef, {sellerId: sellerId, buyerId: buyerId}, {merge: true});

        chatInput.addEventListener("keypress", async (e)=>{
            if (e.key == "Enter") {
                chatSnap = await getDoc(chatRef);
                chat = chatSnap.data().chat;
                if (chat == undefined) {
                    await updateDoc(chatRef, {
                        chat: []
                    });
                    chatSnap = await getDoc(chatRef);
                    chat = chatSnap.data().chat;
                }
                
                chat.push({
                    senderId: user.uid,
                    message: chatInput.value,
                    time: new Date()
                });

                await updateDoc(chatRef, {
                    chat: chat
                });
                chatInput.value = "";
                show();
            }
        });

        show();
    }else{
        alert("請先登入!");
        location.href = "./login.html";
    }
    
    async function show(){
        chatText.innerHTML = "";
        chatSnap = await getDoc(chatRef);
        chat = chatSnap.data().chat;
        chat.forEach((text)=>{
            if (text.senderId == user.uid) {
                chatText.innerHTML += "<div class='user local'><div class='text'>" + text.message + "</div></div>";
            }else{
                chatText.innerHTML += "<div class='user remote'><div class='text'>" + text.message + "</div></div>";
            }
        });
    }
});


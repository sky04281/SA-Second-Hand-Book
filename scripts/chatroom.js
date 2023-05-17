import { auth, db, storage } from "../scripts/firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-auth.js";
import { collection, query, where, and, or, getDocs, getDoc, doc, updateDoc, setDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-firestore.js";

const chatInput = document.querySelector('.chat-input');
const chatText = document.querySelector('.chat-text');
const chatSelect = document.querySelector('.chat-select');

onAuthStateChanged(auth, async (user)=>{
    const userId = user.uid;
    if (user) {
        let chatRef, chatSnap;
        let chat = [];
        const myUrl = new URL(window.location.href);

        //新增聊天室
        if(myUrl.searchParams.has('bookId')){
            const bookId = myUrl.searchParams.get('bookId');

            const bookRef = doc(db, "Product", bookId);
            const bookSnap = await getDoc(bookRef);
            const sellerId = bookSnap.data().sellerId;

            const chatRef = doc(db, "Chatroom", userId + sellerId);
            await setDoc(chatRef, {sellerId: sellerId, buyerId: userId}, {merge: true});
            const chatSnap = await getDoc(chatRef);
            const accountRef = doc(db, "Account", sellerId);
            const accountSnap = await getDoc(accountRef);
            changeChatRoom(chatSnap.id, accountSnap.data().name);
        }   
        
        //左方聊天室-從資料庫抓取
        const colRef = collection(db, "Chatroom");
        const colQuery = query(colRef, or(where("sellerId", "==", userId), where("buyerId", "==", userId)));
        const colSnap = await getDocs(colQuery);

        //左方聊天室-渲染
        colSnap.forEach(async (chatroom)=>{
            let name;
            if (chatroom.data().sellerId == userId) {
                const accountRef = doc(db, "Account", chatroom.data().buyerId);
                const accountSnap = await getDoc(accountRef);
                name = accountSnap.data().name;
            } else {
                const accountRef = doc(db, "Account", chatroom.data().sellerId);
                const accountSnap = await getDoc(accountRef);
                name = accountSnap.data().name;
            }


            chatSelect.innerHTML += 
                "<a href='' id='"+ chatroom.id + "' class='chat-select-btn' name='"+ name +"'>"+
                    "<div class='d-flex justify-content-between  mb-2 pt-2'>"+
                        "<div style='height: 30%; width: 20%; margin-bottom: 6%;'>"+
                            "<img src='https://cdn-icons-png.flaticon.com/512/1946/1946429.png'"+
                                "style='width:100%; height: 100%;'>"+
                        "</div>"+

                        "<div style='height: 30%; width: 70%; margin-top: 5%'>"+
                            "<h6>"+ name +"</h6>"+
                        "</div>"+
                    "</div>"+
                "</a>"+
                "<hr class='mt-0'>";

            const chatSelectBtn = document.querySelectorAll('.chat-select-btn');
            chatSelectBtn.forEach((btn)=>{
                btn.addEventListener('click',(e)=>{
                    e.preventDefault();
                    changeChatRoom(btn.id, btn.name);
                });
            }); 
        });



    }else{
        alert("請先登入!");
        location.href = "./login.html";
    }
    
    async function changeChatRoom(chatRoomId, chatName){
        const chatUserName = document.querySelector('.chat-user-name');
        chatUserName.textContent = chatName;
        const chatRef = doc(db, "Chatroom", chatRoomId);
        let chatSnap = await getDoc(chatRef);

        
        chatInput.addEventListener("keypress", async (e)=>{
            if (e.key == "Enter") {
                chatSnap = await getDoc(chatRef);
                let chat = chatSnap.data().chat;
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
                }).then(async ()=>{
                    chatInput.value = "";
                });
            }
            chatSnap = await getDoc(chatRef);
            show(chatRef, chatSnap);
        });

        show(chatRef, chatSnap);
        console.log("chatData:", chatSnap.data());
    }

    async function show(chatRef, chatSnap){
        chatText.innerHTML = "";
        const chat = chatSnap.data().chat;

        if (chat == undefined) {
            await updateDoc(chatRef, {
                chat: []
            });
            chatSnap = await getDoc(chatRef);
            chat = chatSnap.data().chat;
        }

        chat.forEach((text)=>{
            if (text.senderId == user.uid) {
                chatText.innerHTML += "<div class='user local'><div class='text'>" + text.message + "</div></div>";
            }else{
                chatText.innerHTML += "<div class='user remote'><div class='text'>" + text.message + "</div></div>";
            }
        });
    }
});


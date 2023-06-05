import { auth, db, storage } from "../scripts/firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-auth.js";
import { collection, query, where, and, or, getDocs, getDoc, doc, updateDoc, addDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-firestore.js";

const chatInput = document.querySelector('.chat-input');
const chatText = document.querySelector('.chat-text');
const chatSelect = document.querySelector('.chat-select');

//身分驗證
//假如沒登入
if (!(localStorage.getItem('userId'))) {
    alert('請先登入！');
    location.href = "./login.html";
}
//假如沒驗證
else if (localStorage.getItem('isVerified') != 'true') {
    alert('請先通過身分驗證！');
    location.href = "./account.html";
}

const userId = localStorage.getItem('userId');
//已通過身分驗證
const myUrl = new URL(window.location.href);

//新增聊天室 
//idArr: 存著雙方uid的array, 
//nameArr: 存著雙方name的array],
//chat: 存著每則訊息的array [{senderId: (傳送者的id), message: (傳送的訊息), time: (傳送時間)}]

//從賣書私訊的
if(myUrl.searchParams.has('buyingBookId')){
    const bookId = myUrl.searchParams.get('buyingBookId');
    const bookRef = doc(db, "Product", bookId);
    const bookSnap = await getDoc(bookRef);
    const sellerId = bookSnap.data().sellerId;

    //找現存的聊天室
    //chatCollection
    const chatColRef = collection(db, "Chatroom");
    const chatColQuery = query(chatColRef, where("idArr", "in", [[userId, sellerId], [sellerId, userId]]));
    const chatColSnap = await getDocs(chatColQuery);

    //假如找不到就新增聊天室
    if (chatColSnap.empty) {
        //拿到雙方的名字
        const sellerRef = doc(db, "Account", sellerId);
        const sellerSnap = await getDoc(sellerRef);
        const sellerName = sellerSnap.data().name;
        const userName = localStorage.getItem('userName');

        addDoc(chatColRef,{
            idArr: [userId, sellerId],
            nameArr: [userName, sellerName],
            chat: []
        });
    }
}
//從求書私訊的
else if (myUrl.searchParams.has('wantedBookId')) {
    const bookId = myUrl.searchParams.get('wantedBookId');

    const bookRef = doc(db, "Wanted", bookId);
    const bookSnap = await getDoc(bookRef);
    const buyerId = bookSnap.data().buyerId;

    //chatCollection
    const chatColRef = collection(db, "Chatroom");
    const chatColQuery = query(chatColRef, where("idArr", "in", [[userId, buyerId], [buyerId, userId]]));
    const chatColSnap = await getDocs(chatColQuery);

    if (chatColSnap.empty) {
        //雙方名字
        const buyerRef = doc(db, "Account", buyerId);
        const buyerSnap = await getDoc(buyerRef);
        const buyerName = buyerSnap.data().name;
        const userName = localStorage.getItem('userName');

        //新增聊天室
        addDoc(chatColRef,{
            idArr: [userId, buyerId],
            nameArr: [userName, buyerName],
            chat: []
        });
    }
}

await showChatList(userId, "");
await showChatList(userId, "林");
await showChatList(userId, "若");

const chatSelectBtn = document.querySelectorAll('.chat-select-btn');
chatSelectBtn.forEach((btn)=>{
    btn.addEventListener('click',async (e)=>{
        e.preventDefault();
        console.log(btn.name);
        await changeChatRoom(btn.id, btn.name);
    });
});



//快捷鍵
const fastbtn1 = document.getElementById('fastbtn1');
const btnValue1 = document.getElementById('fastbtn1').innerText;
const fastbtn2 = document.getElementById('fastbtn2');
const btnValue2 = document.getElementById('fastbtn2').innerText;
const fastbtn3 = document.getElementById('fastbtn3');
const btnValue3 = document.getElementById('fastbtn3').innerText;

document.addEventListener('click', function(e) {
    let obj = e.target; 
    if(obj.id == 'fastbtn1') { 
        chatInput.value = "請問「請在此輸入書籍名稱」可以議價嗎？";
    } else if (obj.id == 'fastbtn2') {
        chatInput.value = btnValue2 + " "; 
    } else if(obj.id == 'fastbtn3') {
        chatInput.value = "「請在此輸入書籍名稱」不開放議價喔！";
    }
});

//左方聊天室列表
//uid: 當前使用者id, searchName: 要查詢的名字
async function showChatList(uid = "", searchName = ""){
    chatSelect.innerHTML = "";
    let chatArr = [];
    const userId = uid;
    //左方聊天室-從資料庫抓取
    const colRef = collection(db, "Chatroom");
    const colQuery = query(colRef, where("idArr", "array-contains", userId));
    const colSnap = await getDocs(colQuery);
    
    if (searchName != "") {
        colSnap.forEach((chatrooms)=>{
            let name = "";
            if (chatrooms.data().idArr[0] == userId) {
                name = chatrooms.data().nameArr[1];
            } else {
                name = chatrooms.data().nameArr[0];
            }
            if (name.includes(searchName)) {
                chatArr.push(chatrooms);
            }
        });
    }else{
        chatArr = colSnap.docs;
    }

    //左方聊天室-渲染
    chatArr.forEach((chatroom)=>{
        //找對方的名稱
        let name;
        if (chatroom.data().idArr[0] == userId) {
            name = chatroom.data().nameArr[1];
        } else {
            name = chatroom.data().nameArr[0];
        }

        //渲染左邊那排
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
    });
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
                senderId: userId,
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
        if (text.senderId == userId) {
            chatText.innerHTML += "<div class='user local'><div class='text'>" + text.message + "</div></div>";
        }else{
            chatText.innerHTML += "<div class='user remote'><div class='text'>" + text.message + "</div></div>";
        }
    });
}

import { auth, db, storage } from "../scripts/firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-auth.js";
import { collection, query, where, and, or, getDocs, getDoc, doc, updateDoc, addDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-firestore.js";

const chatInput = document.querySelector('.chat-input'); //訊息輸入欄
const chatText = document.querySelector('.chat-text');  //訊息顯示區域
const chatList = document.querySelector('.chat-list');  //左方列表
let currentChatRef; //目前顯示的聊天室的Reference
let currentScrollTop;   //目前滾輪滾到的位置

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

//新增聊天室 
//idArr: 存著雙方uid的array, 
//nameArr: 存著雙方name的array],
//chat: 存著每則訊息的array [{senderId: (傳送者的id), message: (傳送的訊息), time: (傳送時間)}]
const myUrl = new URL(window.location.href);
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
    await changeChatRoom(sellerId);

    const data = bookSnap.data();
    const text = "您好 我對您上架的書籍有興趣【書名：" + data.book + ", 作者：" + data.author + 
                    ", 出版社：" + data.publish + ", 價格：NT$" + data.price + "】";
    sendText(text);
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

    await changeChatRoom(buyerId);

    const data = bookSnap.data();
    const text = "您好 我有這本書【書名：" + data.book + ", 作者：" + data.author + 
                    ", 出版社：" + data.publish + ", 期望價格：NT$" + data.price + "】";
    sendText(text);
}
//從訂單過來的
else if(myUrl.searchParams.has('someoneId')){
    const someoneId = myUrl.searchParams.get('someoneId');
    
    //chatCollection
    const chatColRef = collection(db, "Chatroom");
    const chatColQuery = query(chatColRef, where("idArr", "in", [[userId, someoneId], [someoneId, userId]]));
    const chatColSnap = await getDocs(chatColQuery);

    if (chatColSnap.empty) {
        //雙方名字
        const someoneRef = doc(db, "Account", someoneId);
        const someoneSnap = await getDoc(someoneRef);
        const someoneName = someoneSnap.data().name;
        const userName = localStorage.getItem('userName');

        //新增聊天室
        addDoc(chatColRef,{
            idArr: [userId, someoneId],
            nameArr: [userName, someoneName],
            chat: []
        });
    }

    await changeChatRoom(someoneId);
}
//直接進來
else{
    const chatColRef = collection(db, "Chatroom");
    const chatColQuery = query(chatColRef, where("idArr", "array-contains", userId));
    const chatColSnap = await getDocs(chatColQuery);

    const firstChat = chatColSnap.docs[0];
    if (firstChat.data().idArr[0] == userId) {
        await changeChatRoom(firstChat.data().idArr[1]);
    }
    else{
        await changeChatRoom(firstChat.data().idArr[0]);
    }
}

//每五秒刷新一次聊天內容
let clock = setInterval(async function () {await show(currentChatRef);}, 5000);

//搜尋欄功能
const chatListSearch = document.querySelector('.chat-list-search');
chatListSearch.addEventListener("keydown", async (e)=>{
    if (e.key == "Enter") {
        await showChatList(userId, chatListSearch.value);
    }
});

//訊息輸入欄功能
chatInput.addEventListener("keydown", async (e)=>{
    if (e.key == "Enter") {
        if (e.shiftKey != true) {
            await sendText(chatInput.value);
            chatInput.value = "";
        }
    }
});

await showChatList(userId, "");

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
    chatList.innerHTML = "";
    let chatArr = [];
    const userId = uid;
    //左方聊天室-從資料庫抓取
    const colRef = collection(db, "Chatroom");
    const colQuery = query(colRef, where("idArr", "array-contains", userId));
    const colSnap = await getDocs(colQuery);
    
    if (searchName != "") {
        colSnap.forEach((chatrooms)=>{
            //對方的名字
            let chatName = "";
            if (chatrooms.data().idArr[0] == userId) {
                chatName = chatrooms.data().nameArr[1];
            } else {
                chatName = chatrooms.data().nameArr[0];
            }
            if (chatName.includes(searchName)) {
                chatArr.push(chatrooms);
            }
        });
    }else{
        chatArr = colSnap.docs;
    }

    //左方聊天室-渲染
    chatArr.forEach((chatrooms)=>{
        //對方的名字
        let chatName = "";
        //對方的uid
        let chatId = "";
        if (chatrooms.data().idArr[0] == userId) {
            chatName = chatrooms.data().nameArr[1];
            chatId = chatrooms.data().idArr[1];
        } else {
            chatName = chatrooms.data().nameArr[0];
            chatId = chatrooms.data().idArr[0];
        }

        //渲染左邊那排
        chatList.innerHTML += 
            "<a href='' id='"+ chatId + "' class='chat-select-btn' name='"+ chatName +"'>"+
                "<div class='d-flex justify-content-between  mb-2 pt-2'>"+
                    "<div style='height: 30%; width: 20%; margin-bottom: 6%;'>"+
                        "<img src='https://cdn-icons-png.flaticon.com/512/1946/1946429.png'"+
                            "style='width:100%; height: 100%;'>"+
                    "</div>"+

                    "<div style='height: 30%; width: 70%; margin-top: 5%'>"+
                        "<h6>"+ chatName +"</h6>"+
                    "</div>"+
                "</div>"+
            "</a>"+
            "<hr class='mt-0'>";
    });

    //切換聊天室的按鈕功能
    const chatSelectBtn = document.querySelectorAll('.chat-select-btn');
    chatSelectBtn.forEach((btn)=>{
        btn.addEventListener('click',async (e)=>{
            e.preventDefault();
            await changeChatRoom(btn.id);
        });
    });
}

//更換聊天室
//chatId: 對方的uid
async function changeChatRoom(chatId = ""){
    //找到對方的名字
    const chatUserName = document.querySelector('.chat-user-name');
    const accountSnap = await getDoc(doc(db, "Account", chatId));
    chatUserName.textContent = accountSnap.data().name;

    //找到聊天室
    const chatColRef = collection(db, "Chatroom");
    const chatColQuery = query(chatColRef, where("idArr", "in", [[userId, chatId], [chatId, userId]]));
    const chatColSnap = await getDocs(chatColQuery);

    currentChatRef = doc(db, "Chatroom", chatColSnap.docs[0].id);

    await show(currentChatRef);
    chatText.scrollTop = chatText.scrollHeight;
}

//刷新訊息
//chatRef: 聊天室的Reference
async function show(chatRef = {}){
    //紀錄滾輪的位置
    currentScrollTop = chatText.scrollTop;
    chatText.innerHTML = "";
    const chatSnap = await getDoc(chatRef);
    const chat = chatSnap.data().chat;

    chat.forEach((text)=>{
        if (text.senderId == userId) {
            chatText.innerHTML += "<div class='user local'><div class='text'>" + text.message + "</div></div>";
        }else{
            chatText.innerHTML += "<div class='user remote'><div class='text'>" + text.message + "</div></div>";
        }
    });

    //移至滾輪位置
    chatText.scrollTop = currentScrollTop;
}

//傳送訊息
//text: 要傳的訊息
async function sendText(text = ""){
    let chatSnap = await getDoc(currentChatRef);
    let chat = chatSnap.data().chat;

    chat.push({
        senderId: userId,
        message: text,
        time: new Date()
    });

    await updateDoc(currentChatRef, {
        chat: chat
    });

    await show(currentChatRef);
}
import { auth, db, storage } from "./firebase.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-auth.js";
import { collection, addDoc, doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-firestore.js";
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-storage.js";

//接編輯的書籍值
const editbook = document.querySelector('.editbook');

let myUrl = new URL(window.location.href);
let bookId = myUrl.searchParams.get('bookId');
console.log(bookId);

let bookRef = doc(db, "Wanted", bookId); 
let bookSnap = await getDoc(bookRef);
console.log(bookSnap.data());

const imgRef = ref(storage, bookSnap.data().imgsrc);
getDownloadURL(imgRef).then((url)=>{
    var img = document.getElementById('book-img');
    img.setAttribute('src', url);
});

/*
let date = new Date();
let imgSrc = "Product/";
let tcate = [];

const colRef = collection(db, "Product");
*/

show();
function show(){
    editbook.innerHTML = editbook.innerHTML +
    "<div class='col-lg-7 mb-5'>" +
    "<div class='contact-form'>" +
            "<form class='editbook' name='sentMessage' id='contactForm' novalidate='novalidate'>" +
                "<div class='form-group'>" +
                    "<input type='text' class='form-control' id='book' placeholder='書名' value="+ bookSnap.data().book +">" +
                "</div>" +
                "<div class='form-group'>" +
                    "<input type='text' class='form-control' id='author' placeholder='作者' value="+ bookSnap.data().author +">" +
                "</div>" +
                "<div class='form-group'>" +
                    "<input type='text' class='form-control' id='publish' placeholder='出版社' value="+ bookSnap.data().publish +">" +
                "</div>" +
                "<div class='form-group'>" +
                    "<input type='text' class='form-control' id='isbn' placeholder='國際書號' value="+ bookSnap.data().isbn +">" +
                "</div>" +
                "<div class='form-group'>" +
                    "<input type='text' class='form-control' id='price' placeholder='預期價格' value="+ bookSnap.data().price +">" +
                "</div>" +
                "<div class='form-group'>" +
                    "<input type='text' class='form-control' id='cate' placeholder='科目' value=" + bookSnap.data().category[4] + ">" +
                "</div>" +
                "<div class='form-group'>" +
                    "<input class='form-control' rows='6' id='info' placeholder='詳細資訊' value="+ bookSnap.data().info +">" +
                "</div>" +
                "<div class='control-group deliver'>" +
                    "<input type='checkbox' name='checkbox' value='聊聊面交'><label  style='margin-right: 5%;'>&nbsp;聊聊面交</label>" +
                    "<input type='checkbox' name='checkbox' value='7-11（運費60元）'><label  style='margin-right: 5%;'>&nbsp;7-11（運費60元）</label>" +
                    "<input type='checkbox' name='checkbox' value='全家（運費60元）'><label  style='margin-right: 5%;'>&nbsp;全家（運費60元）</label>" +
                    "<input type='checkbox' name='checkbox' value='宅配（運費120元）'><label>&nbsp;宅配（運費120元）</label>" +
                    "<p class='help-block text-danger'></p>" +
                "</div>" +
                "<label>付款方式</label>" +
                "<div class='control-group deliver'>" +
                    "<input type='checkbox' name='checkbox1' value='貨到付款'><label  style='margin-right: 5%;'>&nbsp;貨到付款</label>" +
                    "<input type='checkbox' name='checkbox1' value='銀行轉帳'><label  style='margin-right: 5%;'>&nbsp;銀行轉帳</label>" +
                    "<input type='checkbox' name='checkbox1' value='ATM轉帳'><label  style='margin-right: 5%;'>&nbsp;ATM轉帳</label>" +
                    "<p class='help-block text-danger'></p>" +
                "</div>" +
                "<div>" +
                    "<button class='btn btn-primary py-2 px-4' type='submit' id='btn-editbook'>完成編輯</button>" +
                "</div>" +
            "</form>" +
        "</div>" +
    "</div>" +
    "<div class='col-lg-5 mb-5'>" +
        "<div id='upload' style='background-color:white; padding:40% 15%; margin-right:10%;  margin-left:5%; border:0.5px slategray dashed;'>" +
            
            "<div style='background-color:white; width:50%; height:100%; margin:auto; text-align: center;'>" +
            "<img id='book-img' src='' alt='' style='height: 100%; width: 100%;'>" +
            "</div>" +
        "</div>" + 
    "</div>"
}

//接值
let book = document.getElementById("book");
let author = document.getElementById("author");
let publish = document.getElementById("publish");
let isbn = document.getElementById("isbn");
let price = document.getElementById("price");
let cate = document.getElementById("cate");
let info = document.getElementById("info");
let btn = document.getElementById("btn-editbook");

onAuthStateChanged(auth, (user) =>{
    if(user){
        console.log(user);
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            
            //寄送方式
            let delchecked = document.querySelectorAll('input[name="checkbox"]:checked');
            let deloutput = [];
            delchecked.forEach((checkbox) => {
                deloutput.push(checkbox.value);
            });

            while(deloutput.length<4){
                deloutput.push("");
            }

            //付款方式
            let paychecked = document.querySelectorAll('input[name="checkbox1"]:checked');
            let payoutput = [];
            paychecked.forEach((checkbox) => {
                payoutput.push(checkbox.value);
            });

            while(payoutput.length<3){
                payoutput.push("");
            }

            updateDoc(bookRef, {
                buyerId: user.uid,
                author: author.value,
                publish: publish.value,
                isbn: isbn.value,
                price: parseInt(price.value),
                book: book.value,
                category: [bookSnap.data().category[0], bookSnap.data().category[1], bookSnap.data().category[2], bookSnap.data().category[3], cate.value],
                // [0: 地區, 1: 學校, 2: 學院, 3: 科系, 4: 科目]
                info: info.value,
                delivery: deloutput,
                pay: payoutput
            })
            .then(() => {
                alert("完成編輯!")
                location.href = "./wantedhistory.html";
            });
        });

    }else{
        alert("請先登入!");
        location.href = "./login.html";
    }   
});

/*
//如果登入再上架
onAuthStateChanged(auth, async (user) => {
    if (user) {
        console.log(user);
        const userRef = doc(db, "Account", user.uid);
        const userSnap = await getDoc(userRef);
        const data = userSnap.data();

        imgSrc += (user.uid + "/");

        btn.addEventListener("click", (e) => {
            e.preventDefault();

            //存圖片
            if (imgFile) {
                const imgRef = ref(storage, imgSrc);
                uploadBytes(imgRef, imgFile);
            }else{
                imgSrc = "Product/NotFound.jpg";
            }
            

            //書籍資料
            addDoc(colRef, {
                book: book.value,
                author: author.value,
                publish: publish.value,
                isbn: isbn.value,
                price: parseInt(price.value),
                category: [data.area, data.school, data.college, data.department, cate.value],
                // [0: 地區, 1: 學校, 2: 學院, 3: 科系, 4: 科目]
                info: info.value,
                sellerId: user.uid,
                buyerId: "",
                date: date,
                order: [], 
                ordering: "",
                setuptime: "",
                deadline: "",
                imgsrc: imgSrc
            })
                .then(async () => {
                    const totalRef = doc(db, "Account", "Account_Total");
                    const totalSnap = await getDoc(totalRef);
                    tcate = totalSnap.data().tcate;
                    if (tcate.includes(cate.value) == false) {
                        tcate.push(cate.value);
                        await updateDoc(totalRef, {
                            tcate: tcate
                        });
                    }

                    alert("新增成功!")
                    location.href = "./index.html";
                });
        });

    } else {
        alert("請先登入!");
        location.href = "./login.html";
    }
});

上傳照片
const upload = document.getElementById('upload');
const img = document.getElementById('img-img');
const imginput = document.getElementById('img-input');
const imgbtn = document.getElementById("img-btn");
let imgFile;

upload.addEventListener("dragenter", dragenter, false);
upload.addEventListener("dragover", dragover, false);
upload.addEventListener("drop", drop, false);
imgbtn.addEventListener("click", click, false);
img.addEventListener("click", click, false);
imginput.addEventListener("change", 
    function onchange(e) {
        e.preventDefault();
        e.stopPropagation();
        handleFiles(this.files);
    }, false);

function dragenter(e){
    e.stopPropagation();
    e.preventDefault();
}

function dragover(e){
    e.stopPropagation();
    e.preventDefault();
}

function drop(e){
    e.stopPropagation();
    e.preventDefault();

    const dt = e.dataTransfer;
    const files = dt.files;
    handleFiles(files);
}

function click(e){
    e.stopPropagation();
    e.preventDefault();
    imginput.click();
}

function handleFiles(files){
    imgFile = files[0];
    const reader = new FileReader();
    reader.onload = function (e) {
        img.src = e.target.result;
    }
    reader.readAsDataURL(imgFile);
    img.style.display = 'block';
    imgbtn.style.display = 'none';
    upload.style.padding = '5%';
    imgSrc += imgFile.name;
}
*/
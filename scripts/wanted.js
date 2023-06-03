import { auth, db, storage } from "../scripts/firebase.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-auth.js";
import { collection, addDoc, doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-firestore.js";
import { ref, uploadBytes } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-storage.js";

//接值
const book = document.getElementById("book");
const author = document.getElementById("author");
const publish = document.getElementById("publish");
const isbn = document.getElementById("isbn");
const price = document.getElementById("price");
const cate = document.getElementById("cate");
const info = document.getElementById("info");
const btn = document.getElementById("btn-wanted");
let date = new Date();
let imgSrc = "Wanted/";

const colRef = collection(db, "Wanted");

//如果登入再上架
onAuthStateChanged(auth, async (user) => {
    if (user) {
        console.log(user);
        if(user.emailVerified == true){
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
                    imgSrc = "Wanted/NotFound.jpg";
                }
                
                //寄送資料
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

                //書籍資料
                addDoc(colRef, {
                    book: book.value,
                    author: author.value,
                    publish: publish.value,
                    isbn: isbn.value,
                    price: parseInt(price.value),
                    category: [],
                    // [0: 地區, 1: 學校, 2: 學院, 3: 科系, 4: 科目]
                    info: info.value,
                    sellerId: "",
                    buyerId: user.uid,
                    date: date,
                    order: [], 
                    ordering: "",
                    setuptime: "",
                    deadline: "",
                    imgsrc: imgSrc,
                    delivery: deloutput,
                    pay: payoutput
                })
                    .then(async () => {
                        const totalRef = doc(db, "Account", "Account_Total");
                        const totalSnap = await getDoc(totalRef);
                        let totalArea = totalSnap.data().totalArea;
                        
                        //新增類別到該科系
                        totalArea.forEach((a)=>{
                            //找到相同的地區
                            if(a.area == data.area){
                                let totalSchool = a.totalSchool;
                                totalSchool.forEach((s)=>{
                                    //找到相同的學校
                                    if(s.school == data.school){
                                        let totalCollege = s.totalCollege;
                                        totalCollege.forEach((c)=>{
                                            //找到相同的學院
                                            if(c.college == data.college){
                                                let totalDepartment = c.totalDepartment;
                                                totalDepartment.forEach(async (d)=>{
                                                    //找到相同的科系
                                                    if (d.department == data.department) {
                                                        let totalCate = d.totalCate;
                                                        //假如類別不存在 就加入到該科系底下
                                                        if(totalCate.includes(cate.value) == false){
                                                            totalCate.push(cate.value);
                                                            await updateDoc(totalRef, {
                                                                totalArea: totalArea
                                                            });
                                                        }
                                                    }
                                                });
                                            }
                                        });
                                    }
                                });
                            }
                        });

                        alert("新增成功!")
                        location.href = "./index.html";
                    });
            });

        //假如未驗證
        }else{
            alert("請先通過身分驗證！");
            location.href = "./account.html";
        }

    } else {
        alert("請先登入!");
        location.href = "./login.html";
    }
});

//上傳照片
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
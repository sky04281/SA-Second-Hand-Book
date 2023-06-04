import { auth, db, storage } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-auth.js";
import { collection, query, where, and, getDocs, getDoc, doc, orderBy, startAt, endAt } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-firestore.js";
import { ref, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-storage.js";

const booksRef = collection(db, "Product");
const viewSort = document.querySelector('.view-sort');
const viewBook = document.querySelector('.view-book');
const dropdown = document.querySelector('.search-dropdown');
const btn = document.querySelector('.search-btn');
const form = document.querySelector('.search-form');

let search = document.getElementById('search-input');
let selectedArea = "";
let selectedSchool = "";
let selectedCollege = "";
let selectedDepartment = "";
let currentArr = [];
let queryArr = [];
let q, querySnapshot;

//搜尋欄
{
btn.addEventListener("click", async (e) => {
    e.preventDefault();
    myQuery();
});

form.addEventListener("submit", async (e)=>{
    e.preventDefault();
    myQuery();
});
}

//排序按鈕
{
viewSort.innerHTML = 
"<div class='col-12 pb-1'>" +
    "<div class='d-flex align-items-center justify-content-between mb-4'>" +
        "<form class='topbar'>" +
            "<a href='shop.html'>全部商品</a>" + 
        "</form>" +
        "<div class='dropdown ml-4'>" +
            "<button class='btn border dropdown-toggle' type='button' id='triggerId'"  +
                "data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>" +
                        "排序" +
            "</button>" +
        "<div class='dropdown-menu dropdown-menu-right' aria-labelledby='triggerId'>" +
                // "<a class='dropdown-item' href='#'>上架日期由近至遠</a>" +
                // "<a class='dropdown-item' href='#'>上架日期由遠至近</a>" +
                "<a class='sort-price dropdown-item' href='#' id='-1'>價格由高至低</a>" +
                "<a class='sort-price dropdown-item' href='#' id='1'> 價格由低至高</a>" +
            "</div>" +
        "</div>" +
    "</div>" +
"</div>";
}

myQuery();

//分類選單-渲染
const totalRef = doc(db, "Account", "Account_Total");
const totalSnap = await getDoc(totalRef);
const totalArea = totalSnap.data().totalArea;
showDropdown(totalArea, "全部地區", "reset");

//書籍渲染
//arrToShow: 裝著書本的陣列
function show(arrToShow = []){
    
    //書籍
    viewBook.innerHTML = "";
    arrToShow.forEach((docs) => {
        viewBook.innerHTML = viewBook.innerHTML +
            "<div class='col-lg-4 col-md-6 col-sm-12 pb-1'>"+
                "<div class='card product-item border-0 mb-4'>"+
                    "<div class='card-header product-img position-relative overflow-hidden bg-transparent border p-0'>"+
                        "<a href='buyingbook.html?bookId=" + docs.id + "' title=''><img id='"+ docs.id +"' src='' class='img-fluid w-100' alt=''></a>"+
                    "</div>"+
                    "<div class='card-body border-left border-right text-center p-0 pt-4 pb-3'>"+
                        "<a href='buyingbook.html?bookId=" + docs.id + "' class='active'><h6 class='text-truncate mb-3'>"+ docs.data.book +"</h6></a>"+
                        "<div class='d-flex justify-content-center'>"+
                            "<h6>" + "NT$" + docs.data.price + "</h6>"+
                        "</div>"+
                    "</div>"+
                "</div>"+
            "</div>";
        
        //書籍的圖片
        const imgRef = ref(storage, docs.data.imgsrc);
        getDownloadURL(imgRef).then((url) => {
            var img = document.getElementById(docs.id);
            img.setAttribute('src', url);
        });
    });

    search.value = "";

    const sortPrice = document.querySelectorAll('.sort-price');
    sortPrice.forEach((sp)=>{
    sp.addEventListener('click', (e)=>{
        e.preventDefault();
        arrSort(arrToShow, "price", parseInt(sp.id));
        show(arrToShow);
        });
    });

    if (viewBook.innerHTML == "") {
        viewBook.innerHTML += "<h6 class='m-0'>目前沒有書籍！</h6>";
    }

    //分頁按鈕
    // viewBook.innerHTML = viewBook.innerHTML +
    // "<div class='col-12 pb-1'>"+
    //     "<nav aria-label='Page navigation'>"+
    //         "<ul class='pagination justify-content-center mb-3'>"+
    //             "<li class='page-item disabled'>"+
    //                 "<a class='page-link' href='#' aria-label='Previous'>"+
    //                     "<span aria-hidden='true'>&laquo;</span>"+
    //                     "<span class='sr-only'>Previous</span>"+
    //                 "</a>"+
    //             "</li>"+
    //             "<li class='page-item active'><a class='page-link' href='#'>1</a></li>"+
    //             "<li class='page-item'><a class='page-link' href='#'>2</a></li>"+
    //             "<li class='page-item'><a class='page-link' href='#'>3</a></li>"+
    //             "<li class='page-item'>"+
    //                 "<a class='page-link' href='#' aria-label='Next'>"+
    //                     "<span aria-hidden='true'>&raquo;</span>"+
    //                     "<span class='sr-only'>Next</span>"+
    //                 "</a>"+
    //             "</li>"+
    //         "</ul>"+
    //     "</nav>"+
    // "</div>";
}

//查詢功能
async function myQuery(){

    //有輸入書名
    if (search.value == "") {
        querySnapshot = await getDocs(booksRef);
    }
    //沒輸入書名
    else{
        q = query(booksRef, orderBy("book"), startAt(search.value), endAt(search.value + '\uf8ff'));
        querySnapshot = await getDocs(q);
    }

    //放到自訂的陣列裡處理
    queryArr = [];
    querySnapshot.forEach((docs) => {
        const category = docs.data().category;
        const area = category[0];
        const school = category[1];
        const college = category[2];
        const department = category[3];
        
        //假如有登入
        if(localStorage.getItem("userId")){
            //找到 sellerId 不等於 使用者Id 的書
            if (docs.data().sellerId != localStorage.getItem("userId")) {
                //判斷分類選取的情況
                if ((selectedArea != "") & (selectedSchool != "") & (selectedCollege != "") & (selectedDepartment != "")) {
                    if((area == selectedArea) & (school == selectedSchool) & (college == selectedCollege) & (department == selectedDepartment)){
                        queryArr.push({
                            id: docs.id,
                            data: docs.data()
                        });
                    }
                }else if((selectedArea != "") & (selectedSchool != "") & (selectedCollege != "")) {
                    if((area == selectedArea) & (school == selectedSchool) & (college == selectedCollege)){
                        queryArr.push({
                            id: docs.id,
                            data: docs.data()
                        });
                    }
                }else if((selectedArea != "") & (selectedSchool != "")) {
                    if((area == selectedArea) & (school == selectedSchool)){
                        queryArr.push({
                            id: docs.id,
                            data: docs.data()
                        });
                    }
                }else if((selectedArea != "")) {
                    if((area == selectedArea)){
                        queryArr.push({
                            id: docs.id,
                            data: docs.data()
                        });
                    }
                }else{
                    queryArr.push({
                        id: docs.id,
                        data: docs.data()
                    });
                }
            }   
        }
        //假如沒登入
        else{
            if ((selectedArea != "") & (selectedSchool != "") & (selectedCollege != "") & (selectedDepartment != "")) {
                if((area == selectedArea) & (school == selectedSchool) & (college == selectedCollege) & (department == selectedDepartment)){
                    queryArr.push({
                        id: docs.id,
                        data: docs.data()
                    });
                }
            }else if((selectedArea != "") & (selectedSchool != "") & (selectedCollege != "")) {
                if((area == selectedArea) & (school == selectedSchool) & (college == selectedCollege)){
                    queryArr.push({
                        id: docs.id,
                        data: docs.data()
                    });
                }
            }else if((selectedArea != "") & (selectedSchool != "")) {
                if((area == selectedArea) & (school == selectedSchool)){
                    queryArr.push({
                        id: docs.id,
                        data: docs.data()
                    });
                }
            }else if((selectedArea != "")) {
                if((area == selectedArea)){
                    queryArr.push({
                        id: docs.id,
                        data: docs.data()
                    });
                }
            }else{
                queryArr.push({
                    id: docs.id,
                    data: docs.data()
                });
            }
        }
    });

    //預設價格小到大
    arrSort(queryArr, "price");
    show(queryArr);
    search.value = "";
}

//排序
//arr: 要排序的陣列, key: 排序的依據, choose: 1=小到大 -1=大到小
function arrSort(arr = [], key = "price", choose = 1){
    var temp;
    switch (key) {
        case "price":
            if (choose == -1) {
                for (let i = 0; i < arr.length; i++) {
                    for(let j = 0; j < arr.length -1; j++){
                        if (arr[j].data.price < arr[j + 1].data.price) {
                            temp = arr[j + 1];
                            arr[j + 1] = arr[j];
                            arr[j] = temp;
                        }
                    }
                }
            }else{
                for (let i = 0; i < arr.length; i++) {
                    for(let j = 0; j < arr.length -1; j++){
                        if (arr[j].data.price > arr[j + 1].data.price) {
                            temp = arr[j + 1];
                            arr[j + 1] = arr[j];
                            arr[j] = temp;
                        }
                    }
                }
            }
            
            break;
        case "date":
            break;
    }
    
}

//分類選單的顯示
//selectedArr: TotalArea、TotalSchool...等, selected: "北北基"、"輔仁大學"...等, Type: "area"、"school"...等 
async function showDropdown(currentTotal = [], selectedValue = "" , type = "area"){
    const dropdwonHeader = document.querySelector('.select-header');
    dropdwonHeader.textContent = selectedValue;
    const topbar = document.querySelector('.topbar');
    dropdown.innerHTML = "";
    //重製or第一次進來
    if (type == "reset") {
        //清除分類
        selectedArea = "";
        selectedSchool = "";
        selectedCollege = "";
        selectedDepartment = "";
        topbar.innerHTML = "<a href='shop.html'>全部商品</a>";

        currentArr = totalArea;
        currentTotal.forEach((a)=>{
            dropdown.innerHTML +=
                "<div class='nav-item dropdown'>"+
                    "<a href='#' class='dropdown-select nav-link' data-toggle='dropdown' name='area'>"+ a.area + 
                    "</a>"+
                "</div>";
        });

    //假如點擊地區
    }else if(type == "area"){
        selectedArea = selectedValue;
        document.querySelector('.topbar').innerHTML = 
                "<a href='shop.html'>全部商品</a>" + " > " + selectedArea;
        currentTotal.forEach((a)=>{
            if (a.area == selectedValue) {
                const totalSchool = a.totalSchool;
                currentArr = totalSchool;
                totalSchool.forEach((s)=>{
                    dropdown.innerHTML +=
                    "<div class='nav-item dropdown'>"+
                        "<a href='#' class='dropdown-select nav-link' data-toggle='dropdown' name='school'>"+ s.school + 
                        "</a>"+
                    "</div>";
                });
            }
        });

    //假如點擊學校
    }else if(type == "school"){
        selectedSchool = selectedValue;
        document.querySelector('.topbar').innerHTML = 
                "<a href='shop.html'>全部商品</a>" + " > " + selectedArea + " > " + selectedSchool;
        currentTotal.forEach((s)=>{
            if (s.school == selectedValue) {
                const totalCollege = s.totalCollege;
                currentArr = totalCollege;
                totalCollege.forEach((c)=>{
                    dropdown.innerHTML +=
                    "<div class='nav-item dropdown'>"+
                        "<a href='#' class='dropdown-select nav-link' data-toggle='dropdown' name='college'>"+ c.college + 
                        "</a>"+
                    "</div>";
                });
            }
        });

    //假如點擊學院
    }else if(type == "college"){
        selectedCollege = selectedValue;
        document.querySelector('.topbar').innerHTML = 
                "<a href='shop.html'>全部商品</a>" + " > " + selectedArea + " > " + selectedSchool + 
                " > " + selectedCollege;
        currentTotal.forEach((c)=>{
            if (c.college == selectedValue) {
                const totalDepartment = c.totalDepartment;
                currentArr = totalDepartment;
                totalDepartment.forEach((d)=>{
                    dropdown.innerHTML +=
                    "<div class='nav-item dropdown'>"+
                        "<a href='#' class='dropdown-select nav-link' data-toggle='dropdown' name='department'>"+ d.department + 
                        "</a>"+
                    "</div>";
                });
            }
        });
    }

    //假如分類是空的
    if(dropdown.innerHTML == ""){
        dropdown.innerHTML =
            "<div class='nav-item dropdown'>"+
                "<a href='#' class='dropdown-select nav-link' data-toggle='dropdown' name='reset'>"+ "請等待更多人加入此網站!" + 
                "</a>"+
            "</div>";
    }

    //控制類別選單跟重製按鈕的顯示(避免重複重製)
    if (type != "reset") {
        dropdown.innerHTML +=
            "<div class='nav-item dropdown'>"+
                "<a href='#' class='cate-current nav-link' data-toggle='dropdown' name='cate'>類別 <i"+
                    "class='fa fa-angle-down float-right mt-1'></i></a>"+
                "<div class='dropdown-cate dropdown-menu position-absolute bg-secondary border-0 rounded-0 w-100 m-0'>"+
                "</div>"+
            "</div>";
        
        dropdown.innerHTML +=
            "<div class='nav-item dropdown'>"+
                "<a href='#' class='dropdown-select nav-link' data-toggle='dropdown' name='reset'>"+ "重置分類" + 
                "</a>"+
            "</div>";
        getCate(currentTotal, type);
    }

    //給按鈕加上功能
    if (type != "department") {
        const dropdownSelects = document.querySelectorAll('.dropdown-select');
        dropdownSelects.forEach((select)=>{
            select.addEventListener('click',(e)=>{
                e.preventDefault();
                e.stopPropagation();
                if(select.name == "reset"){
                    showDropdown(totalArea, "全部地區", "reset");
                    const dropdownList = document.querySelector('.dropdown-list');
                    dropdownList.classList.remove("show");
                }else if(select.name == "department"){
                    selectedDepartment = select.textContent;
                    document.querySelector('.topbar').innerHTML = 
                        "<a href='shop.html'>全部商品</a>" + " > " + selectedArea + " > " + selectedSchool + 
                        " > " + selectedCollege + " > " + selectedDepartment;
                }else{
                    showDropdown(currentArr, select.textContent, select.name);
                }
                myQuery();
            });
        });
    }
}

//渲染類別
//arr: 抓取類別的範圍 TotalArea...等, type: 判斷現在的範圍 area...等
async function getCate(arr = [], type = "area"){
    const dropdownCate = document.querySelector('.dropdown-cate');
    dropdownCate.innerHTML = ""
    let cateArr = [];
    //假如是地區被按下
    if (type == "area") {
        arr.forEach((a)=>{
            if (a.area == selectedArea) {
                let totalSchool = a.totalSchool;
                totalSchool.forEach((s)=>{
                    let totalCollege = s.totalCollege;
                    totalCollege.forEach((c)=>{
                        let totalDepartment = c.totalDepartment;
                        totalDepartment.forEach((d)=>{
                            let totalCate = d.totalCate;
                            totalCate.forEach((cates)=>{
                                if (!(cateArr.includes(cates))) {
                                    cateArr.push(cates);
                                }
                            });
                        });
                    });
                });
            }
        });
    }
    //假如是學校被按下
    else if (type == "school") {
        arr.forEach((s)=>{
            if (s.school == selectedSchool) {
                let totalCollege = s.totalCollege;
                totalCollege.forEach((c)=>{
                    let totalDepartment = c.totalDepartment;
                    totalDepartment.forEach((d)=>{
                        let totalCate = d.totalCate;
                        totalCate.forEach((cates)=>{
                            if (!(cateArr.includes(cates))) {
                                cateArr.push(cates);
                            }
                        });
                    });
                });
            }
        });
    }
    //假如是學院被按下
    else if (type == "college") {
        arr.forEach((c)=>{
            if (c.college == selectedCollege) {
                let totalDepartment = c.totalDepartment;
                totalDepartment.forEach((d)=>{
                    let totalCate = d.totalCate;
                    totalCate.forEach((cates)=>{
                        if (!(cateArr.includes(cates))) {
                            cateArr.push(cates);
                        }
                    });
                });
            }
        });
    }
    //假如是科系被按下
    else if (type == "department") {
        arr.forEach((d)=>{
            if (d.department == selectedDepartment) {
                let totalCate = d.totalCate;
                totalCate.forEach((cates)=>{
                    if (!(cateArr.includes(cates))) {
                        cateArr.push(cates);
                    }
                });
            }
        });
    }

    if (cateArr.length !== 0) {
        cateArr.forEach((cates)=>{
            dropdownCate.innerHTML +=
                "<a href='' class='cate-select dropdown-item'>"+ cates +"</a>";
        });
    }else{
        dropdownCate.innerHTML +=
                "<a href='' class='cate-none dropdown-item'>"+ "目前無分類！" +"</a>";
    }

    const cates = document.querySelectorAll('.cate-select');
    cates.forEach((cateBtn)=>{
        cateBtn.addEventListener("click",(e)=>{
            e.preventDefault();
            e.stopPropagation();
            document.querySelector('.cate-current').textContent = cateBtn.textContent;
            document.querySelector('.dropdown-cate').classList.remove("show");
            document.querySelector('.topbar').innerHTML = 
                "<a href='shop.html'>全部商品</a>" + " > " + selectedArea + " > " + selectedSchool + 
                " > " + selectedCollege + " > " + selectedDepartment + " > " + cateBtn.textContent;
            changeCate(queryArr, cateBtn.textContent);
        });
    });
}

//類別的功能
//arr: 目前顯示的書籍陣列 queryArr, cate: 選到的類別
function changeCate(arr = [], cate = ""){
    let changedArr = [];
    arr.forEach((docs)=>{
        const bookCate = docs.data.category[4];
        if (bookCate == cate) {
            changedArr.push(docs);
        }
    });

    arrSort(changedArr, "price", 1);
    show(changedArr);
}
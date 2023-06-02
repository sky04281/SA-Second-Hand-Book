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
let selectedCate = "";
let queryArr = [];
let q, querySnapshot;



//分類選單-渲染
{
const totalRef = doc(db, "Account", "Account_Total");
const totalSnap = await getDoc(totalRef);
const totalArea = totalSnap.data().totalArea;
totalArea.forEach((a)=>{
    dropdown.innerHTML +=
        "<div class='nav-item dropdown'>"+
            "<a href='#' class='dropdown-select nav-link' data-toggle='dropdown' name='area'>"+ a.area + 
            "</a>"+
        "</div>";
});
        
    dropdown.innerHTML +=
        "<div class='nav-item dropdown'>"+
            "<a href='#' class='nav-link' data-toggle='dropdown' name='cate'>類別 <i"+
                "class='fa fa-angle-down float-right mt-1'></i></a>"+
            "<div class='dropdown-cate dropdown-menu position-absolute bg-secondary border-0 rounded-0 w-100 m-0'>"+
            "</div>"+
        "</div>";
}

//分類選單-功能
const dropdownSelects = document.querySelectorAll('.dropdown-select');
dropdownSelects.forEach((select)=>{
    select.addEventListener('click',(e)=>{
        e.preventDefault();
        if(selectedSchool == ""){
            selectedSchool = select.textContent;

        }
    });
});


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

myQuery();

//書籍渲染
function show(){
    //排序按鈕
    viewSort.innerHTML = 
        "<div class='col-12 pb-1'>" +
            "<div class='d-flex align-items-center justify-content-between mb-4'>" +
                "<form>" +
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
        
    
    
    //書籍
    queryArr.forEach((docs) => {
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

        const imgRef = ref(storage, docs.data.imgsrc);
        getDownloadURL(imgRef).then((url) => {
            var img = document.getElementById(docs.id);
            img.setAttribute('src', url);
        });
    });

    //分頁按鈕
    viewBook.innerHTML = viewBook.innerHTML +
    "<div class='col-12 pb-1'>"+
        "<nav aria-label='Page navigation'>"+
            "<ul class='pagination justify-content-center mb-3'>"+
                "<li class='page-item disabled'>"+
                    "<a class='page-link' href='#' aria-label='Previous'>"+
                        "<span aria-hidden='true'>&laquo;</span>"+
                        "<span class='sr-only'>Previous</span>"+
                    "</a>"+
                "</li>"+
                "<li class='page-item active'><a class='page-link' href='#'>1</a></li>"+
                "<li class='page-item'><a class='page-link' href='#'>2</a></li>"+
                "<li class='page-item'><a class='page-link' href='#'>3</a></li>"+
                "<li class='page-item'>"+
                    "<a class='page-link' href='#' aria-label='Next'>"+
                        "<span aria-hidden='true'>&raquo;</span>"+
                        "<span class='sr-only'>Next</span>"+
                    "</a>"+
                "</li>"+
            "</ul>"+
        "</nav>"+
    "</div>";

    search.value = "";

    const sortPrice = document.querySelectorAll('.sort-price');
    sortPrice.forEach((sp)=>{
        sp.addEventListener('click', (e)=>{
            e.preventDefault();
            arrSort(queryArr, "price", parseInt(sp.id));
            show();
        });
    });
}



//查詢功能
async function myQuery(){

    if (search.value == "") {
        querySnapshot = await getDocs(booksRef);
    }
    else{
        q = query(booksRef, orderBy("book"), startAt(search.value), endAt(search.value + '\uf8ff'));
        querySnapshot = await getDocs(q);
    }

    //放到自訂的陣列裡處理排序
    queryArr = [];
    querySnapshot.forEach((docs) => {
        if (localStorage.getItem('userId')){
            if (docs.data().sellerId != localStorage.getItem('userId')) {
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
    });

    //預設價格小到大
    arrSort(queryArr, "price");
    show();
    search.value = "";
}

//排序
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

async function showDropdown(totalArea = [], selected = "" , type = "area"){
    if(type = "area"){
        
    }
}
import { auth, db } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-auth.js";
import { collection, query, where, getDocs, doc } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-firestore.js";


const ref = collection(db, "Product");
const view = document.querySelector('.viewbook');
const btn = document.querySelector('.btn-search');
const form = document.querySelector('.from-search')

let search = document.getElementById('input-search');
let q, querySnapshot;

btn.addEventListener("click", async (e) => {
    e.preventDefault();
    if (search.value == "") {
        querySnapshot = await getDocs(ref);
        show();
        }
    else{
        q = query(ref, where("book", "==", search.value));
        querySnapshot = await getDocs(q);
        show();
        search.value = "";
    }
    
});

form.addEventListener("submit", async (e)=>{
    e.preventDefault();
    if (search.value == "") {
        querySnapshot = await getDocs(ref);
        show();
    }
    else{
        q = query(ref, where("book", "==", search.value));
        querySnapshot = await getDocs(q);
        show();
        search.value = "";
    }
    
});

querySnapshot = await getDocs(ref);
show();


function show(){
    view.innerHTML = "";
    
    //書籍
    querySnapshot.forEach( (docs) => {
        view.innerHTML = view.innerHTML +
            "<div class='col-lg-4 col-md-6 col-sm-12 pb-1'>"+
                "<div class='card product-item border-0 mb-4'>"+
                    "<div class='card-header product-img position-relative overflow-hidden bg-transparent border p-0'>"+
                        "<a href='buyingbook.html' title=''><img src='img/product-2.jpg' class='img-fluid w-100' alt=''></a>"+
                    "</div>"+
                    "<div class='card-body border-left border-right text-center p-0 pt-4 pb-3'>"+
                        "<a href='buyingbook.html' class='active'><h6 class='text-truncate mb-3'>"+ docs.data().book +"</h6></a>"+
                        "<div class='d-flex justify-content-center'>"+
                            "<h6>" + "NT$" + docs.data().price + "</h6>"+
                        "</div>"+
                    "</div>"+
                "</div>"+
            "</div>";
        
    });

    //分頁按鈕
    view.innerHTML = view.innerHTML +
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
}



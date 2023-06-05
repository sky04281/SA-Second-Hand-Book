import { auth, db, storage } from "./firebase.js";
import { collection, query, where, and, getDocs, getDoc, doc, orderBy, startAt, endAt } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-firestore.js";
import { ref, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-storage.js";


const buyingbook = document.querySelector('.buyingbook');

let myUrl = new URL(window.location.href);
let bookId = myUrl.searchParams.get('bookId');
console.log(bookId);

let bookRef = doc(db, "Product", bookId);
let bookSnap = await getDoc(bookRef);
console.log(bookSnap.data());
// 接到值了 bookSnap.data().book 是書名，以此類推

show();
const imgRef = ref(storage, bookSnap.data().imgsrc);
getDownloadURL(imgRef).then((url)=>{
    var img = document.getElementById('book-img');
    img.setAttribute('src', url);
});

//書籍渲染
function show(){
        buyingbook.innerHTML = buyingbook.innerHTML +
                "<div class='col-lg-5 pb-5'>"+
                    "<img id='book-img' class='w-100 h-100' src='' alt=''>"+
                "</div>"+

                "<div class='col-lg-5 pb-5'>"+
                    "<h3 class='font-weight-semi-bold'>"+bookSnap.data().book+"</h3>"+
                    
                    "<h3 class='font-weight-semi-bold mb-4'>NT$ "+bookSnap.data().price+"</h3>"+
                    "<p class='mb-4'>"+
                        "作者：" + bookSnap.data().author +"<br>"+
                        "出版社：" + bookSnap.data().publish + "<br>"+
                        "國際書號：" + bookSnap.data().isbn + "<br>"+
                        "類別：" + bookSnap.data().category[4] + "<br>"+
                    "</p>"+
                    "<div class='col'>"+
                        "<div class='nav nav-tabs justify-content border-secondary mb-4'>"+
                            "<a class='nav-item nav-link active' data-toggle='tab' href='#tab-pane-1'>商品描述</a>"+
                            "<a class='nav-item nav-link' data-toggle='tab' href='#tab-pane-2'>配送方式</a>"+
                        "</div>"+
                        
                        "<div class='tab-content'>"+
                            "<div class='tab-pane fade show active' id='tab-pane-1'>"+
                                "<p>"+bookSnap.data().info+"</p>"+
                            "</div>"+
                            "<div class='tab-pane fade' id='tab-pane-2'>"+
                                "<p>" + bookSnap.data().delivery[0] + "</p>"+
                                "<p>" + bookSnap.data().delivery[1] + "</p>"+
                                "<p>" + bookSnap.data().delivery[2] + "</p>"+
                                "<p>" + bookSnap.data().delivery[3] + "</p>"+
                            "</div>"+
                        "</div>"+
                    "</div>"+
                    
                    "<div class='d-flex align-items-center mb-4 pt-2'>"+
                        "<a href='chatroom.html?buyingBookId=" + bookId + "'>"+
                            "<button class='btn btn-primary py-2 px-4' type='submit'>" + 
                                "<i class='fa fa-comments mr-1'></i>私訊"+
                            "</button>"+
                        "</a>" +

                        "&nbsp;"+

                        "<a href='order.html?bookId=" + bookId + "'>"+
                            "<button class='btn btn-primary py-2 px-4' type='submit'>"+
                                "<i class='fa fa-shopping-cart mr-1'></i>購買"+
                            "</button>"+
                        "</a>" +
                    "</div>"+
                    
                "</div>" +
                
                "<div class='col-lg-2 pb-5'>"+
                "</div>";

        
    
}
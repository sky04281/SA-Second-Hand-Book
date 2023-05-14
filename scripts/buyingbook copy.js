import { auth, db } from "./firebase.js";
import { collection, query, where, and, getDocs, getDoc, doc, orderBy, startAt, endAt } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-firestore.js";

const buyingbook = document.querySelector('.buyingbook');

let myUrl = new URL(window.location.href);
let bookId = myUrl.searchParams.get('bookId');
console.log(bookId);

let bookRef = doc(db, "Product", bookId);
let bookSnap = await getDoc(bookRef);
console.log(bookSnap.data());
// 接到值了 bookSnap.data().book 是書名，以此類推

show();

//書籍渲染
function show(){
        buyingbook.innerHTML = buyingbook.innerHTML +
            "<div class='col-lg-5 pb-5'>"+
                    "<div id='product-carousel' class='carousel slide' data-ride='carousel'>"+
                        "<div class='carousel-inner border'>"+
                            "<div class='carousel-item active'>"+
                                "<img class='w-100 h-100' src='img/product-1.jpg' alt='Image'>"+
                            "</div>"+
                            "<div class='carousel-item'>"+
                                "<img class='w-100 h-100' src='img/product-2.jpg' alt='Image'>"+
                            "</div>"+
                        "</div>"+
                        "<a class='carousel-control-prev' href='#product-carousel' data-slide='prev'>"+
                            "<i class='fa fa-2x fa-angle-left text-dark'></i>"+
                        "</a>"+
                        "<a class='carousel-control-next' href='#product-carousel' data-slide='next'>"+
                            "<i class='fa fa-2x fa-angle-right text-dark'></i>"+
                        "</a>"+
                    "</div>"+
                "</div>"+

                "<div class='col-lg-7 pb-5'>"+
                    "<h3 class='font-weight-semi-bold'>"+bookSnap.data().book+"</h3>"+
                    
                    "<h3 class='font-weight-semi-bold mb-4'>$ "+bookSnap.data().price+"</h3>"+
                    "<p class='mb-4'>作者："+bookSnap.data().author+"<br>出版社："+bookSnap.data().publish+"<br>國際書號："+bookSnap.data().isbn+"<br>類別："+bookSnap.data().cate+"<br>"+
                        


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
                                
                                "<p>雙北可聊聊面交</p>"+
                                "<p>超商配送：7-11（運費60元）、全家（運費60元）</p>"+
                                "<p>宅配（運費120元）</p>"+
                                
                            "</div>"+
                            
                        "</div>"+
                    "</div>"+
                    
                    "<div class='d-flex align-items-center mb-4 pt-2'>"+
                        "<a href='order.html'><button class='btn btn-primary py-2 px-4' type='submit' id='editbookButton'><i class='fa fa-shopping-cart mr-1'></i>購買</button></a>"
                        "&nbsp;"+
                        "<a href='chatroom.html'><button class='btn btn-primary py-2 px-4' type='submit' id='deletebookButton'><i class='fa fa-comments mr-1'></i>私訊</button></a>"+
                    "</div>"+
                    
                "</div>"

        
    
}
import { auth, db } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-auth.js";
import { collection, query, where, getDocs, doc, deleteDoc, updateDoc} from "https://www.gstatic.com/firebasejs/9.20.0/firebase-firestore.js";



onAuthStateChanged(auth, async (user) => {
    if(user){
        // 用 sellerId 從資料庫抓出使用者上架的書
        const ref = collection(db, "Product");
        const q = query(ref, where("sellerId", "==", user.uid), where("order", "array-contains", true));
        const p = query(ref);
        const querySnapshot = await getDocs(q);
        const view = document.getElementById("sellernotify");

        // 把書本列出來
        querySnapshot.forEach( (docs) => {
            view.innerHTML = view.innerHTML +
            "<tr>" +
                "<td class='align-middle'><img src='' alt='' style='width: 50px;'>" + docs.data().book +"</td>" +
                "<td class='align-middle text-left'>寄送方式: " + docs.data().order[0] +
                    "<br>寄送地址: " + docs.data().order[1] +
                    "<br>付款方式: " + docs.data().order[2] +
                    "<br>備註: " + docs.data().order[3] +
                "</td>" +
                "<td class='align-middle'>"+ docs.data().ordering+ "</td>" +
                "<td class='align-middle'>"+
                    "<button class='btn btn-sm btn-check' id='" + docs.id +"'><i class='fas fa-check'>確認訂單</i></button>"+
                    "<button class='btn btn-sm btn-delete' id='"+ docs.id + "'><i class='fas fa-times'>取消訂單</i></button>"+
                "</td>"+
            "</tr>";
        });


            var btn1 = document.querySelectorAll('.btn-check');
            btn1.forEach((b) => {
                b.addEventListener('click', (e) => {
                    e.preventDefault();
                    var docRef = doc(db, 'Product', b.id);
                    updateDoc(docRef, {
                        ordering: "賣家接收訂單，交易成立"
                    })
                    .then(() => {
                        alert("您已確認訂單!");
                        location.reload();
                    });
                });
            });
            
            var btn2 = document.querySelectorAll('.btn-delete');
            btn2.forEach((b) => {
                b.addEventListener('click', (e) => {
                    e.preventDefault();
                    var docRef = doc(db, 'Product', b.id);
                    updateDoc(docRef, {
                        buyerId: "",
                        order: [], 
                        ordering: ""
                    })
                    .then(() => {
                        alert("已取消訂單!");
                        location.reload();
                    });
                });
            });
        

    }else{
        alert("請先登入!");
        location.href = "./index.html";
    }
});



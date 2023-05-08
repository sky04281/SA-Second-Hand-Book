import { auth, db } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-auth.js";
import { collection, query, where, getDocs, doc, deleteDoc} from "https://www.gstatic.com/firebasejs/9.20.0/firebase-firestore.js";



onAuthStateChanged(auth, async (user) => {
    if(user){
        // 用 sellerId 從資料庫抓出使用者上架的書
        const ref = collection(db, "Product");
        const q = query(ref, where("sellerId", "==", user.uid));
        const p = query(ref, where("buyerId", "!=", ""));
        const querySnapshot = await getDocs(q, p);
        const view = document.getElementById("sellernotify");

        // 把書本列出來
        querySnapshot.forEach( (docs) => {
            view.innerHTML = view.innerHTML +
            "<tr>" +
                "<td class='align-middle'><img src='' alt='' style='width: 50px;'>" + docs.data().book + "</td>" +
                "<td class='align-middle'>"+
                    "<button class='btn id='order' btn-sm'><a href=''><i class='fas fa-check'>確認訂單</i></a></button>"+
                    "<button class='btn btn-sm btn-delete' id='"+ docs.id + "'><i class='fas fa-times'>取消訂單</i></button>"+
                "</td>"+
            "</tr>";
        });

        // 給下架按鈕加上刪除的功能
        var btn = document.querySelectorAll('.btn-delete');
        btn.forEach((b) => {
            b.addEventListener('click', (e) => {
                e.preventDefault();
                var docRef = doc(db, 'Product', );
                deleteDoc(docRef)
                .then(() => {
                    alert("已成功刪除!");
                    location.reload();
                });
            });
        });

    }else{
        alert("請先登入!");
        location.href = "./index.html";
    }
});



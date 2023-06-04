import { auth, db } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-auth.js";
import { collection, query, where, getDocs, doc, deleteDoc, updateDoc} from "https://www.gstatic.com/firebasejs/9.20.0/firebase-firestore.js";



onAuthStateChanged(auth, async (user) => {
    if(user){
        // 用 sellerId 從資料庫抓出使用者上架的書
        const ref = collection(db, "Wanted");
        const q = query(ref, where("buyerId", "==", user.uid), where("ordering", "==", ""));
        const p = query(ref, where("buyerId", "==", user.uid), where("order", "array-contains", true));
        const r = query(ref, where("buyerId", "==", user.uid), where("ordering", "==", "訂單成立，請至訂單追蹤查看"));
        const querySnapshot = await getDocs(q);
        const querySnapshot_hasorder = await getDocs(p);
        const querySnapshot_hasproduct = await getDocs(r);
        const view = document.getElementById("viewbook");
        const order = document.getElementById("wantedorder");

        // 把書本列出來
        querySnapshot.forEach( (docs) => {
            view.innerHTML = view.innerHTML +
            "<tr>" +
                "<td class='align-middle'><img src='' alt='' style='width: 50px;'>" + docs.data().book + "</td>" +
                "<td class='align-middle'>"+
                    "<button class='btn btn-sm'><a href='wantededitbook.html?bookId=" + docs.id + "'><i class='fa fa-pen'></i></a></button>"+
                "</td>"+
                "<td class='align-middle'>"+
                    "<button class='btn btn-sm btn-delete' id='"+ docs.id + "'><i class='fa fa-trash'></i></button>"+
                "</td>"+
            "</tr>";
        });

        //列出有賣家出價的書
        querySnapshot_hasorder.forEach( (docs) => {
            view.innerHTML = view.innerHTML +
            "<tr>" +
                "<td class='align-middle'><img src='' alt='' style='width: 50px;'>" + docs.data().book + "</td>" +
                "<td class='align-middle'><img src='' alt='' style='width: 50px;'>訂單已成立無法變更書籍內容</td>" +
                "<td class='align-middle'>"+
                    "<button class='btn btn-sm btn-delete' id='"+ docs.id + "'><i class='fa fa-trash'></i></button>"+
                "</td>"+
            "</tr>";
            order.innerHTML = order.innerHTML +
            "<tr>" +
                "<td class='align-middle'><img src='' alt='' style='width: 50px;'>" + docs.data().book +"</td>" +
                "<td class='align-middle text-left'>寄送方式: " + docs.data().order[0] +
                    "<br>賣家出價: " + docs.data().order[2] +
                    "<br>付款方式: " + docs.data().order[3] +
                    "<br>備註: " + docs.data().order[4] +
                "</td>" +
                "<td class='align-middle'><img src='' alt='' style='width: 50px;'>" + docs.data().ordering +"</td>" +
                "<td class='align-middle'><button class='btn btn-sm btn-check' id='" + docs.id +"'><a href='wantedcheck.html?bookId=" + docs.id + "'><i class='fas fa-check'>接受並填寫完整資料</i></a></button>"+
                "<br><button class='btn btn-sm btn-cancel' id='" + docs.id +"'><i class='fas fa-times'>拒絕此訂單</i></button></td>"+
            "</tr><br>";
        });

        querySnapshot_hasproduct.forEach( (docs) => {
            view.innerHTML = view.innerHTML +
            "<tr>" +
                "<td class='align-middle'><img src='' alt='' style='width: 50px;'>" + docs.data().book + "</td>" +
                "<td class='align-middle'><img src='' alt='' style='width: 50px;'>訂單已成立無法變更書籍內容</td>" +
                "<td class='align-middle'>"+
                    "<button class='btn btn-sm btn-delete' id='"+ docs.id + "'><i class='fa fa-trash'></i></button>"+
                    "(不影響已成立訂單)"
                "</td>"+
            "</tr>";
            order.innerHTML = order.innerHTML +
            "<tr>" +
                "<td class='align-middle'><img src='' alt='' style='width: 50px;'>" + docs.data().book +"</td>" +
                "<td class='align-middle text-left'>寄送方式: " + docs.data().order[0] +
                    "<br>賣家出價: " + docs.data().order[2] +
                    "<br>付款方式: " + docs.data().order[3] +
                    "<br>備註: " + docs.data().order[4] +
                "</td>" +
                "<td class='align-middle'><img src='' alt='' style='width: 50px;'>" + docs.data().ordering +"</td>" +
                "<td class='align-middle'><i class='fas fa-times'></i></td>"+
            "</tr><br>";
        });



        // 給下架按鈕加上刪除的功能
        var btn = document.querySelectorAll('.btn-delete');
        btn.forEach((b) => {
            b.addEventListener('click', (e) => {
                e.preventDefault();
                var docRef = doc(db, 'Wanted', b.id);
                deleteDoc(docRef)
                .then(() => {
                    alert("已成功刪除!");
                    location.reload();
                });
            });
        });

        var btn = document.querySelectorAll('.btn-cancel');
        btn.forEach((b) => {
            b.addEventListener('click', (e) => {
                e.preventDefault();
                var docRef = doc(db, 'Wanted', b.id);
                updateDoc(docRef, {
                    sellerId: "",
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



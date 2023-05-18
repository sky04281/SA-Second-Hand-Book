import { auth, db } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-auth.js";
import { collection, query, where, getDocs, doc, updateDoc} from "https://www.gstatic.com/firebasejs/9.20.0/firebase-firestore.js";



onAuthStateChanged(auth, async (user) => {
    if(user){
        // 用 sellerId 從資料庫抓出使用者上架的書
        const ref = collection(db, "Product");
        const q = query(ref, where("buyerId", "==", user.uid), where("order", "array-contains", true), where("ordering", "==", "待賣家確認"));
        const n = query(ref, where("buyerId", "==", user.uid), where("order", "array-contains", false), where("ordering", "==", "取消訂單"));
        const p = query(ref, where("buyerId", "==", user.uid), where("order", "array-contains", true), where("ordering", "==", "賣家接收訂單，交易成立"));
        const r = query(ref, where("buyerId", "==", user.uid), where("order", "array-contains", true), where("ordering", "==", "賣家已出貨，待買家收取並完成訂單"));
        const s = query(ref, where("buyerId", "==", user.uid), where("order", "array-contains", true), where("ordering", "==", "買家已完成訂單"));
        const querySnapshot_q = await getDocs(q);
        const querySnapshot_p = await getDocs(p);
        const querySnapshot_r = await getDocs(r);
        const querySnapshot_s = await getDocs(s);
        const querySnapshot_n = await getDocs(n);
        const view = document.getElementById("buyernotify");

        // 把書本列出來
        querySnapshot_q.forEach( (docs) => {
            view.innerHTML = view.innerHTML +
            "<tr><td colspan='4'>待處理訂單</td></tr><tr>" +
                "<td class='align-middle'><img src='' alt='' style='width: 50px;'>" + docs.data().book +"</td>" +
                "<td class='align-middle text-left'>寄送方式: " + docs.data().order[0] +
                    "<br>寄送地址: " + docs.data().order[1] +
                    "<br>付款方式: " + docs.data().order[2] +
                    "<br>備註: " + docs.data().order[3] +
                "</td>" +
                "<td class='align-middle'>"+ docs.data().ordering+ "</td>" +
                "<td class='align-middle'><button class='btn btn-sm btn-cancel' id='" + docs.id +"'><i class='fas fa-poo'>取消訂單</i></button>"+"</td>"+
            "</tr><br>";
        });

        querySnapshot_p.forEach( (docs) => {
            view.innerHTML = view.innerHTML +
            "<tr><td colspan='4'>待出貨訂單</td></tr><tr>" +
                "<td class='align-middle'><img src='' alt='' style='width: 50px;'>" + docs.data().book +"</td>" +
                "<td class='align-middle text-left'>寄送方式: " + docs.data().order[0] +
                    "<br>寄送地址: " + docs.data().order[1] +
                    "<br>付款方式: " + docs.data().order[2] +
                    "<br>備註: " + docs.data().order[3] +
                "</td>" +
                "<td class='align-middle'>"+ docs.data().ordering+ "</td>" +
                "<td class='align-middle'><i class='fas fa-times'></i></td>"+
            "</tr><br>";
        });

        querySnapshot_r.forEach( (docs) => {
            view.innerHTML = view.innerHTML +
            "<tr><td colspan='4'>商品已到貨，請取貨並完成訂單</td></tr><tr>" +
                "<td class='align-middle'><img src='' alt='' style='width: 50px;'>" + docs.data().book +"</td>" +
                "<td class='align-middle text-left'>寄送方式: " + docs.data().order[0] +
                    "<br>寄送地址: " + docs.data().order[1] +
                    "<br>付款方式: " + docs.data().order[2] +
                    "<br>備註: " + docs.data().order[3] +
                "</td>" +
                "<td class='align-middle'>"+ docs.data().ordering+ "</td>" +
                "<td class='align-middle'>" + 
                    "<button class='btn btn-sm btn-delete' id='" + docs.id +"'><i class='fas fa-check'>完成訂單</i></button>" + 
                "</td>"+
            "</tr><br>";
        });

        querySnapshot_s.forEach( (docs) => {
            view.innerHTML = view.innerHTML +
            "<tr><td colspan='4'>待評價訂單</td></tr><tr>" +
                "<td class='align-middle'><img src='' alt='' style='width: 50px;'>" + docs.data().book +"</td>" +
                "<td class='align-middle text-left'>寄送方式: " + docs.data().order[0] +
                    "<br>寄送地址: " + docs.data().order[1] +
                    "<br>付款方式: " + docs.data().order[2] +
                    "<br>備註: " + docs.data().order[3] +
                "</td>" +
                "<td class='align-middle'>"+ docs.data().ordering+ "</td>" +
                "<td class='align-middle'>" + 
                    "<button class='btn btn-sm btn-comment' id='" + docs.id +"' href='comment.html'><i class='fas fa-arrow-right'>前往評價</i></button>" + 
                "</td>"+
            "</tr><br>";
        });
        querySnapshot_n.forEach( (docs) => {
            view.innerHTML = view.innerHTML +
            "<tr><td colspan='4'>已取消訂單</td></tr><tr>" +
                "<td class='align-middle'><img src='' alt='' style='width: 50px;'>" + docs.data().book +"</td>" +
                "<td class='align-middle text-left'>寄送方式: " + docs.data().order[0] +
                    "<br>寄送地址: " + docs.data().order[1] +
                    "<br>付款方式: " + docs.data().order[2] +
                    "<br>備註: " + docs.data().order[3] +
                "</td>" +
                "<td class='align-middle'>"+ docs.data().ordering+ "</td>" +
                "<td class='align-middle'> 取消成功</td>"+
            "</tr><br>";
        });

        // 給下架按鈕加上刪除的功能
        var btn1 = document.querySelectorAll('.btn-delete');
        btn1.forEach((b) => {
            b.addEventListener('click', (e) => {
                e.preventDefault();
                var docRef = doc(db, 'Product', b.id);
                updateDoc(docRef, {
                    ordering: "買家已完成訂單"
                })
                .then(() => {
                    alert("已完成訂單!");
                    location.reload();
                });
            });
        });

    }else{
        alert("請先登入!");
        location.href = "./index.html";
    }
});



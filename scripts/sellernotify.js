import { auth, db } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-auth.js";
import { collection, query, where, getDocs, doc, deleteDoc, updateDoc,getDoc} from "https://www.gstatic.com/firebasejs/9.20.0/firebase-firestore.js";



onAuthStateChanged(auth, async (user) => {
    if(user){
        // 用 sellerId 從資料庫抓出使用者上架的書
        const ref = collection(db, "Product");
        const q = query(ref, where("sellerId", "==", user.uid), where("order", "array-contains", true), where("ordering", "==", "待賣家確認"));
        const p = query(ref, where("sellerId", "==", user.uid), where("order", "array-contains", true), where("ordering", "==", "賣家接收訂單，交易成立"));
        const r = query(ref, where("sellerId", "==", user.uid), where("order", "array-contains", true), where("ordering", "==", "賣家已出貨，待買家收取並完成訂單"));
        const a = query(ref, where("sellerId", "==", user.uid), where("order", "array-contains", true), where("ordering", "==", "已完成評價"));
        const query_buyerscore = query(ref, where("sellerId", "==", user.uid), where("order", "array-contains", true), where("ordering", "==", "買家已完成訂單"))
        const s = query(ref, where("sellerId", "==", user.uid), where("order", "array-contains", true), where("ordering", "==", "買家已完成評價"));
        const querySnapshot_q = await getDocs(q);
        const querySnapshot_p = await getDocs(p);
        const querySnapshot_r = await getDocs(r);
        const querySnapshot_s = await getDocs(s);
        const querySnapshot_a = await getDocs(a);
        const querySnapshot_buyerscore = await getDocs(query_buyerscore);
        const view = document.getElementById("sellernotify");

        
        // 把書本列出來
        querySnapshot_q.forEach(async (docs) => {
            view.innerHTML = view.innerHTML +
            "<tr><td colspan='4'>待處理訂單</td></tr><tr>" +
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
                    "<br><a class='btn btn-sm' href='chatroom.html?someoneId="+docs.data().buyerId+"'><i class='fas fa-comments text-primary'>私訊買家</i></a>" +
                "</td>"+
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
                "<td class='align-middle'>"+
                    "<button class='btn btn-sm btn-sent' id='" + docs.id +"'><i class='fas fa-check'>確認出貨</i></button>"+
                    "<br><a class='btn btn-sm' href='chatroom.html?someoneId="+docs.data().buyerId+"'><i class='fas fa-comments text-primary'>私訊買家</i></a>" +
                "</td>"+
            "</tr>";
        });

        querySnapshot_r.forEach( (docs) => {
            view.innerHTML = view.innerHTML +
            "<tr><td colspan='4'>待完成訂單</td></tr><tr>" +
                "<td class='align-middle'><img src='' alt='' style='width: 50px;'>" + docs.data().book +"</td>" +
                "<td class='align-middle text-left'>寄送方式: " + docs.data().order[0] +
                    "<br>寄送地址: " + docs.data().order[1] +
                    "<br>付款方式: " + docs.data().order[2] +
                    "<br>備註: " + docs.data().order[3] +
                "</td>" +
                "<td class='align-middle'>"+ docs.data().ordering+ "</td>" +
                "<td class='align-middle'>"+
                    "<button class='btn btn-sm''><i class='fas fa-times'></i></button>"+
                    "<br><a class='btn btn-sm' href='chatroom.html?someoneId="+docs.data().buyerId+"'><i class='fas fa-comments text-primary'>私訊買家</i></a>" +
                "</td>"+
            "</tr>";
        });

        querySnapshot_buyerscore.forEach( (docs) => {
            view.innerHTML = view.innerHTML +
            "<tr><td colspan='4'>待評價訂單</td></tr><tr>" +
                "<td class='align-middle'><img src='' alt='' style='width: 50px;'>" + docs.data().book +"</td>" +
                "<td class='align-middle text-left'>寄送方式: " + docs.data().order[0] +
                    "<br>寄送地址: " + docs.data().order[1] +
                    "<br>付款方式: " + docs.data().order[2] +
                    "<br>備註: " + docs.data().order[3] +
                "</td>" +
                "<td class='align-middle'>"+ docs.data().ordering+ "，待買家評價</td>" +
                "<td class='align-middle'>"+
                "<button class='btn btn-sm''><i class='fas fa-times'></i></button>"+ 
                    "<br><a class='btn btn-sm' href='chatroom.html?someoneId="+docs.data().buyerId+"'><i class='fas fa-comments text-primary'>私訊買家</i></a>" +
                "</td>"+
            "</tr>";
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
                "<td class='align-middle'>"+
                    "<button class='btn btn-sm btn-goodcomment' id='" + docs.data().buyerId +"'><i class='fas fa-thumbs-up'></i></button>" + 
                    "<button class='btn btn-sm btn-badcomment' id='" + docs.data().buyerId+"'><i class='fas fa-thumbs-down'></i></button>" + 
                    "<a class='btn btn-sm btn-inform' href='comment.html?bookId="+docs.id+"'><i class='fas fa-exclamation'>檢舉</i></a>" + 
                    "<br><a class='btn btn-sm' href='chatroom.html?someoneId="+docs.data().buyerId+"'><i class='fas fa-comments text-primary'>私訊買家</i></a>" +
                "</td>"+
            "</tr>";
        });
        //已評價
        querySnapshot_a.forEach((docs) => {
            view.innerHTML = view.innerHTML +
                "<tr><td colspan='4'>已評價訂單</td></tr><tr>" +
                "<td class='align-middle'><img src='' alt='' style='width: 50px;'>" + docs.data().book + "</td>" +
                "<td class='align-middle text-left'>寄送方式: " + docs.data().order[0] +
                "<br>寄送地址: " + docs.data().order[1] +
                "<br>付款方式: " + docs.data().order[2] +
                "<br>備註: " + docs.data().order[3] +
                "</td>" +
                "<td class='align-middle'>" + docs.data().ordering + "</td>" +
                "<td class='align-middle'> 訂單完成</td>" +
                "</tr><br>";
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
                        order: ["", "", "", "", false], 
                        ordering: ""
                    })
                    .then(() => {
                        alert("已取消訂單!");
                        location.reload();
                    });
                });
            });

            var btn3 = document.querySelectorAll('.btn-sent');
            btn3.forEach((b) => {
                b.addEventListener('click', (e) => {
                    e.preventDefault();
                    var docRef = doc(db, 'Product', b.id);
                    updateDoc(docRef, {
                        ordering: "賣家已出貨，待買家收取並完成訂單"
                    })
                    .then(() => {
                        alert("已完成出貨!");
                        location.reload();
                    });
                });
            }); 

   // 評價按鈕
   var btn4 = document.querySelectorAll('.btn-goodcomment');
   btn4.forEach((e) => {
       e.addEventListener('click', async (f) => {
           f.preventDefault();
           const scoreRef = doc(db, "Account", e.id);
           const scoreSnap = await getDoc(scoreRef);
           updateDoc(scoreRef, {
               score: scoreSnap.data().score + 1,
           })
           const docRef = query(ref, where("buyerId", "==", e.id), where("ordering", "==", "買家已完成評價"));
           const docreff = await getDocs(docRef)
           docreff.forEach(async (temp) => {
               const bookid = temp.id
               console.log(bookid)
               const oref = doc(db, "Product", bookid);
               updateDoc(oref, {
                   ordering: "已完成評價"
               })
               .then(() => {
                alert("評價成功!");
                location.reload();
            });
           })
       })
   })

   var btn5 = document.querySelectorAll('.btn-badcomment');
   btn5.forEach((e) => {
       e.addEventListener('click', async (f) => {
           f.preventDefault();
           const scoreRef = doc(db, "Account", e.id);
           const scoreSnap = await getDoc(scoreRef);
           updateDoc(scoreRef, {
               score: scoreSnap.data().score - 1
           })
           const docRef = query(ref, where("buyerId", "==", e.id), where("ordering", "==", "買家已完成評價"));
           const docreff = await getDocs(docRef)
           docreff.forEach(async (temp) => {
               const bookid = temp.id
               console.log(bookid)
               const oref = doc(db, "Product", bookid);
               updateDoc(oref, {
                   ordering: "已完成評價"
               })
               .then(() => {
                alert("評價成功!");
                location.reload();
            });
           })
       })
   })

    }else{
        alert("請先登入!");
        location.href = "./index.html";
    }
});
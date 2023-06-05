import { auth, db } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-auth.js";
import { collection, query, where, getDocs, doc, updateDoc } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-firestore.js";



onAuthStateChanged(auth, async (user) => {
    if (user) {
        // 用 buyerId 從資料庫抓出使用者下單的書
        const ref = collection(db, "Product");
        const q = query(ref, where("buyerId", "==", user.uid), where("order", "array-contains", true), where("ordering", "==", "待賣家確認"));
        const n = query(ref, where("buyerId", "==", user.uid), where("order", "array-contains", true), where("ordering", "==", "取消訂單"));
        const p = query(ref, where("buyerId", "==", user.uid), where("order", "array-contains", true), where("ordering", "==", "賣家接收訂單，交易成立"));
        const r = query(ref, where("buyerId", "==", user.uid), where("order", "array-contains", true), where("ordering", "==", "賣家已出貨，待買家收取並完成訂單"));
        const a = query(ref, where("buyerId", "==", user.uid), where("order", "array-contains", true), where("ordering", "==", "已完成評價"));
        const s = query(ref, where("buyerId", "==", user.uid), where("order", "array-contains", true), where("ordering", "==", "買家已完成訂單"));
        const querySnapshot_q = await getDocs(q);
        const querySnapshot_p = await getDocs(p);
        const querySnapshot_r = await getDocs(r);
        const querySnapshot_s = await getDocs(s);
        const querySnapshot_n = await getDocs(n);
        const querySnapshot_a = await getDocs(a);
        const view = document.getElementById("buyernotify");

        const reff = collection(db, "Account");
        const c = query(reff, where("buyerId", "==", user.uid), where("ordering", "==", "已完成評價"));
        const querySnapshot_c = await getDocs(c);
        const commentview = document.getElementById("buyernotify");




        // 把書本列出來
        // 賣家待確認訂單
        querySnapshot_q.forEach((docs) => {
            view.innerHTML = view.innerHTML +
                "<tr><td colspan='4'>待處理訂單</td></tr><tr>" +
                "<td class='align-middle'><img src='' alt='' style='width: 50px;'>" + docs.data().book + "</td>" +
                "<td class='align-middle text-left'>寄送方式: " + docs.data().order[0] +
                "<br>寄送地址: " + docs.data().order[1] +
                "<br>付款方式: " + docs.data().order[2] +
                "<br>備註: " + docs.data().order[3] +
                "</td>" +
                "<td class='align-middle'>" + docs.data().ordering + "</td>" +
                "<td class='align-middle'><button class='btn btn-sm btn-cancel' id='" + docs.id + "'><i class='fas fa-poo'>取消訂單</i></button>" + "</td>" +
                "</tr><br>";
        });

        // 賣家帶出貨訂單
        querySnapshot_p.forEach((docs) => {
            view.innerHTML = view.innerHTML +
                "<tr><td colspan='4'>待出貨訂單</td></tr><tr>" +
                "<td class='align-middle'><img src='' alt='' style='width: 50px;'>" + docs.data().book + "</td>" +
                "<td class='align-middle text-left'>寄送方式: " + docs.data().order[0] +
                "<br>寄送地址: " + docs.data().order[1] +
                "<br>付款方式: " + docs.data().order[2] +
                "<br>備註: " + docs.data().order[3] +
                "</td>" +
                "<td class='align-middle'>" + docs.data().ordering + "</td>" +
                "<td class='align-middle'><i class='fas fa-times'></i></td>" +
                "</tr><br>";
        });

        // 商品已到貨待買家完成訂單
        querySnapshot_r.forEach((docs) => {
            view.innerHTML = view.innerHTML +
                "<tr><td colspan='4'>商品已到貨，請取貨並完成訂單</td></tr><tr>" +
                "<td class='align-middle'><img src='' alt='' style='width: 50px;'>" + docs.data().book + "</td>" +
                "<td class='align-middle text-left'>寄送方式: " + docs.data().order[0] +
                "<br>寄送地址: " + docs.data().order[1] +
                "<br>付款方式: " + docs.data().order[2] +
                "<br>備註: " + docs.data().order[3] +
                "</td>" +
                "<td class='align-middle'>" + docs.data().ordering + "</td>" +
                "<td class='align-middle'>" +
                "<button class='btn btn-sm btn-finish' id='" + docs.id + "'><i class='fas fa-check'>完成訂單</i></button>" +
                "<button class='btn btn-sm btn-unreceive' id='" + docs.id + "'><i class='fas fa-times'>未收到貨</i></button>" +
                "</td>" +
                "</tr><br>";
        });

        // 待評價訂單
        querySnapshot_s.forEach((docs) => {
            view.innerHTML = view.innerHTML +
                "<tr><td colspan='4'>待評價訂單</td></tr><tr>" +
                "<td class='align-middle'><img src='' alt='' style='width: 50px;'>" + docs.data().book + "</td>" +
                "<td class='align-middle text-left'>寄送方式: " + docs.data().order[0] +
                "<br>寄送地址: " + docs.data().order[1] +
                "<br>付款方式: " + docs.data().order[2] +
                "<br>備註: " + docs.data().order[3] +
                "</td>" +

                "<td class='align-middle'>" + docs.data().ordering + "</td>" +
                "<td class='align-middle'>" +
                "<button class='btn btn-sm btn-goodcomment' id='" + docs.data().sellerId + "'><i class='fas fa-thumbs-up'></i></button>" +
                "<button class='btn btn-sm btn-badcomment' id='" + docs.data().sellerId + "'><i class='fas fa-thumbs-down'></i></button>" +
                "<a class='btn btn-sm btn-inform' href='inform.html?bookId=" + docs.id + "'><i class='fas fa-exclamation'>檢舉</i></button>" +
                "</td>" +
                "</tr><br>";

                "<td class='align-middle'>"+ docs.data().ordering+ "</td>" +
                "<td class='align-middle'>" + 
                    "<button class='btn btn-sm btn-goodcomment' id='" + docs.data().sellerId +"'><i class='fas fa-thumbs-up'></i></button>" + 
                    "<button class='btn btn-sm btn-badcomment' id='" + docs.data().sellerId+"'><i class='fas fa-thumbs-down'></i></button>" + 
                    "<a class='btn btn-sm btn-inform' href='comment.html?bookId="+docs.id+"'><i class='fas fa-exclamation'>檢舉</i></button>" + 
                "</td>"+
            "</tr><br>";
        });

        // 已取消訂單
        querySnapshot_n.forEach((docs) => {
            view.innerHTML = view.innerHTML +
                "<tr><td colspan='4'>已取消訂單</td></tr><tr>" +
                "<td class='align-middle'><img src='' alt='' style='width: 50px;'>" + docs.data().book + "</td>" +
                "<td class='align-middle text-left'>寄送方式: " + docs.data().order[0] +
                "<br>寄送地址: " + docs.data().order[1] +
                "<br>付款方式: " + docs.data().order[2] +
                "<br>備註: " + docs.data().order[3] +
                "</td>" +
                "<td class='align-middle'>" + docs.data().ordering + "</td>" +
                "<td class='align-middle'> 取消成功</td>" +
                "</tr><br>";
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


        //確定評價
        querySnapshot_c.forEach((docs) => {
            commentview.innerHTML = commentview.innerHTML +
                "<tr><td colspan='4'>待評價訂單</td></tr><tr>" +
                "<td class='align-middle'><button class='btn btn-sm btn-check' id='" + docs.id + "'><i class='fas fa-check'>確定評價</i></button>" +
                "</tr><br>";
        });

        // 完成訂單按鈕
        var btn1 = document.querySelectorAll('.btn-finish');
        btn1.forEach((b) => {
            b.addEventListener('click', (e) => {
                e.preventDefault();
                var docRef = doc(db, 'Product', b.id);
                console.log(docRef);
                updateDoc(docRef, {
                    ordering: "買家已完成訂單"
                })
                //.then(() => {
                alert("已完成訂單!");
                location.reload();
            });
        });
        // });

        // 取消訂單按鈕
        var btn2 = document.querySelectorAll('.btn-cancel');
        btn2.forEach((c) => {
            c.addEventListener('click', (d) => {
                d.preventDefault();
                var docRef = doc(db, 'Product', c.id);
                updateDoc(docRef, {
                    order: ["", "", "", "", false],
                    ordering: "取消訂單",
                    order:["", "", "", "", false],
                    ordering: "取消訂單",
                    deadline: "",
                    setuptime: "",
                    buyerId: ""
                })
                    .then(() => {
                        alert("取消成功!");
                        location.reload();
                    });
            });
        });


        // 評價按鈕
        var btn3 = document.querySelectorAll('.btn-goodcomment');
        const account = collection(db, "Account");
        const userscore=await getDocs(score);
        const score = query(account, where("score", "!=", 0),where("uid","==",e.id));
        userscore.forEach((c)=>{
            console.log(c.data().score);})
            btn3.forEach((e) => {
                e.addEventListener('click', (f) => {
                    f.preventDefault();
                    //getScore(e.id);
                    var docRef=doc(db,'Account',e.id);
                     var number=1;
                     var newscore= 7+number ;
                     updateDoc(docRef,{
                         score:newscore,
                         ordering:"已完成評價"
                     })
                     console.log(score)
                    /*.then(()=>{
                        alert("確定評價");
                    })*/
                })
            })
        



        async function getScore(sellerId) { 
            const account = collection(db, "Account");
            const score = query(account, where("uid", "==", sellerId));
            const id = await getDocs(score);
            id.forEach((docs) => {
                console.log(docs.data())
            })
        }


        /* var btn4=document.querySelectorAll('.btn-goodcomment');
         btn4.forEach((e) => {
             e.addEventListener('click', (f)=>{
                 f.preventDefault();
                 var docRef=doc(db,'Account',e.id);
                 updateDoc(docRef,{
                     score:6
                 })
                 .then(()=>{
                     alert("評價成功!");
                 })
             })
         })*/

        // 未收到貨按鈕
        var btn5 = document.querySelectorAll('.btn-unreceive');
        btn5.forEach((b) => {
            b.addEventListener('click', (e) => {
                e.preventDefault();
                var docRef = doc(db, 'Product', b.id);
                console.log(docRef);
                updateDoc(docRef, {
                    ordering: "買家未收到貨"
                })
                    .then(() => {
                        alert("與賣家進行聯絡");
                        location.href = "./chatroom.html?bookId=" + b.id + "";
                    });
            });
        });

        //確定評價
        var btn6 = document.querySelectorAll('.btn-check');
        btn6.forEach((c) => {
            c.addEventListener('click', (d) => {
                d.preventDefault();
                var docRef = doc(db, 'Product', c.id);
                updateDoc(docRef, {
                    ordering: "已完成評價"
                })
                    .then(() => {
                        alert("評價成功!");
                        location.reload();
                    });
            });
        });


    } else {
        alert("請先登入!");
        location.href = "./index.html";
    }




});




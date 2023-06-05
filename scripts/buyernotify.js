import { auth, db } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-auth.js";
import { collection, query, where, getDocs, doc, updateDoc, getDoc } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-firestore.js";



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

        const check = query(ref, where("buyerId", "==", user.uid), where("order", "array-contains", true));
        const checkdeadline = await getDocs(check);


        checkdeadline.forEach((docs) => {
            const deadline = docs.data().deadline;
            console.log(docs.data().deadline);
            console.log(docs.id);
            if(Date.now() > deadline.toMillis()){
                var docRef = doc(db, 'Product', docs.id);
                updateDoc(docRef, {
                    buyerId: "",
                    order: ["", "", "", "", false],
                    ordering: "",
                    setuptime: "",
                    deadline: ""
                }).then(() => {
                    alert("有訂單已超時，將自動刪除!");
                    location.href = "./buyernotify.html";
                });
            }
        });


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
                "<td class='align-middle'><button class='btn btn-sm btn-cancel' id='" + docs.id + "'><i class='fas fa-poo'>取消訂單</i></button>" + 
                "<br><a class='btn btn-sm' href='chatroom.html?someoneId="+docs.data().sellerId+"'><i class='fas fa-comments text-primary'>私訊賣家</i></a>" +
                "</td>" +
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
                "<td class='align-middle'><i class='fas fa-times'></i>" +
                "<br><a class='btn btn-sm' href='chatroom.html?someoneId="+docs.data().sellerId+"'><i class='fas fa-comments text-primary'>私訊賣家</i></a>" +
                "</td>" +
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
                "<br><a class='btn btn-sm' href='chatroom.html?someoneId="+docs.data().sellerId+"'><i class='fas fa-comments text-primary'>私訊賣家</i></a>" +
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
                "<a class='btn btn-sm btn-inform' href='inform.html?bookId=" + docs.id + "'><i class='fas fa-exclamation'>檢舉</i></a>" +
                "<br><a class='btn btn-sm' href='chatroom.html?someoneId="+docs.data().sellerId+"'><i class='fas fa-comments text-primary'>私訊賣家</i></a>" +
                "</td>" +
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
                    order: ["", "", "", "", false],
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
        btn3.forEach((e) => {
            e.addEventListener('click', async (f) => {
                f.preventDefault();
                const scoreRef = doc(db, "Account", e.id);
                const scoreSnap = await getDoc(docRef);
                updateDoc(scoreRef, {
                    score: scoreSnap.data().score + 1,
                    ordering: "已完成評價"

                })
                var docRef = doc(db,"Product",e.id);
                updateDoc(docRef,{
                    ordering:"已完成評價"
                })
                
            })
        })

        var btn4 = document.querySelectorAll('.btn-badcomment');
        btn4.forEach((e) => {
            e.addEventListener('click', async (f) => {
                f.preventDefault();
                const docRef = doc(db, "Account", e.id);
                const scoreSnap = await getDoc(docRef);
                updateDoc(docRef, {
                    score: scoreSnap.data().score -1,
                    ordering: "已完成評價"

                })
            })
        })

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




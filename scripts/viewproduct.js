import { auth, db } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-auth.js";
import { collection, query, where, getDocs, doc, deleteDoc} from "https://www.gstatic.com/firebasejs/9.20.0/firebase-firestore.js";



onAuthStateChanged(auth, async (user) => {
    if(user){
        const ref = collection(db, "Product");
        const q = query(ref, where("sellerId", "==", user.uid));
        const querySnapshot = await getDocs(q);
        const view = document.getElementById("viewbook");
        
        querySnapshot.forEach( (docs) => {
            view.innerHTML = view.innerHTML +
            "<tr>" +
                "<td class='align-middle'><img src='' alt='' style='width: 50px;'>" + docs.data().book + "</td>" +
                "<td class='align-middle'>"+
                    "<button class='btn btn-sm'><a href='editbook.html'><i class='fa fa-pen'></i></a></button>"+
                    "<button class='btn btn-sm btn-delete' id='"+ docs.id + "'><i class='fa fa-trash'></i></button>"+
                "</td>"+
            "</tr>";
        });

        var btn = document.querySelectorAll('.btn-delete');
        btn.forEach((b) => {
            b.addEventListener('click', (e) => {
                e.preventDefault();
                var docRef = doc(db, 'Product', b.id);
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



import { auth, db } from "../scripts/firebase.js";
import { createUserWithEmailAndPassword, sendEmailVerification } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-auth.js";
import { doc, setDoc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-firestore.js";

const name = document.getElementById("name");
const area = document.getElementById("area");
const school = document.getElementById("school");
const college = document.getElementById("college");
const department = document.getElementById("department");
const email = document.getElementById("email");
const password = document.getElementById("password");
const btn = document.getElementById("btn-register");
let uid = "";
let tschool = [];
let tcollege = [];
let tdepartment = [];

//抓取已有的學校 學院 科系
const totalRef = doc(db, "Account", "Account_Total");
const totalSnap = await getDoc(totalRef);
tschool = totalSnap.data().tschool;
tcollege = totalSnap.data().tcollege;
tdepartment = totalSnap.data().tdepartment;


btn.addEventListener("click", (e) => {
    e.preventDefault();
    createUserWithEmailAndPassword(auth, email.value, password.value)
        .then((userCredential) => {
            sendEmailVerification(auth.currentUser);
            uid = userCredential.user.uid;

            //加到 Account
            const docRef = doc(db, "Account", uid);
            setDoc(docRef, {
                name: name.value,
                area: area.value,
                school: school.value,
                college: college.value,
                department: department.value,
                score: 0
            }).then(async () => {
                
                if (tschool.includes(school) == false) {
                    tschool.push(school.value);
                }

                if (tcollege.includes(college) == false) {
                    tcollege.push(college.value);
                }

                if (tdepartment.includes(department) == false) {
                    tdepartment.push(department.value);
                }

                console.log(tschool, tcollege,tdepartment)
                await updateDoc(totalRef, {
                    tschool: tschool,
                    tcollege: tcollege,
                    tdepartment: tdepartment
                });
                alert("註冊成功！ 已發送驗證信！");
                location.href = "./login.html";
            });

        })
        .catch((error) => {
            const errorMessage = error.message;
            console.log(errorMessage);
            alert(errorMessage);
        });
});




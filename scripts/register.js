import { auth, db } from "../scripts/firebase.js";
import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-auth.js";
import { doc, setDoc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-firestore.js";

const name = document.getElementById("name");
const area = document.getElementById("area");
const school = document.getElementById("school");
const college = document.getElementById("college");
const department = document.getElementById("department");
const email = document.getElementById("email");
const password = document.getElementById("password");
const passwordCheck = document.getElementById("password-check");
const btn = document.getElementById("btn-register");
let uid = "";

//抓取已有的學校 學院 科系
const totalRef = doc(db, "Account", "Account_Total");
const totalSnap = await getDoc(totalRef);
let totalArea = totalSnap.data().totalArea;
console.log(totalArea);


btn.addEventListener("click", (e) => {
    if (email.value.includes("gmail.com") | email.value.includes("yahoo") | email.value.includes("hotmail")) {
        alert("請使用學校信箱！");
    }
    else if (password.value != passwordCheck.value) {
        alert("兩次輸入的密碼不符合！")
    }else{
        let sure = confirm("即將註冊 資料是否無誤？");
        e.preventDefault();
        if (sure) {
            createUserWithEmailAndPassword(auth, email.value, password.value)
            .then((userCredential) => {
                sendEmailVerification(auth.currentUser);
                updateProfile(auth.currentUser, {
                    displayName: name.value,
                });
                uid = userCredential.user.uid;


                //加到 Account
                const docRef = doc(db, "Account", uid);
                setDoc(docRef, {
                    name: name.value,
                    area: area.value,
                    school: school.value,
                    college: college.value,
                    department: department.value,
                    score: 7
                }).then(async () => {

                    //分類選單用
                    totalArea.forEach((a)=>{
                        if (a.area == area.value) {
                            let totalSchool = a.totalSchool;
                            let hasSchool = false;
                            totalSchool.forEach((s)=>{
                                //假如學校(School)存在
                                if (s.school == school.value) {
                                    hasSchool = true;
                                    let totalCollege = s.totalCollege;
                                    let hasCollege = false;
                                    //假如學院(College)存在
                                    totalCollege.forEach((c)=>{
                                        if (c.college == college.value) {
                                            hasCollege = true;
                                            let totalDepartment = c.totalDepartment;
                                            let hasDepartment = false;
                                            //假如科系(Department)存在
                                            totalDepartment.forEach((d)=>{
                                                if (d.department == department.value) {
                                                    hasDepartment = true;
                                                }
                                            });
                                            //假如科系(Department)不存在
                                            if (hasDepartment == false) {
                                                totalDepartment.push({
                                                    department: department.value,
                                                    totalCate: []
                                                });
                                            }
                                        }
                                    });
                                    //假如學院(College)不存在
                                    if (hasCollege == false) {
                                        totalCollege.push({
                                            college: college.value,
                                            totalDepartment: [{
                                                department: department.value,
                                                totalCate: []
                                            }]
                                        });
                                    }
                                }
                            });
                            //假如學校(School)不存在
                            if (hasSchool == false) {
                                totalSchool.push({
                                    school: school.value,
                                    totalCollege: [{
                                        college: college.value,
                                        totalDepartment: [{
                                            department: department.value,
                                            totalCate: []}]
                                    }]
                                });
                            }
                        }
                    });
                    await updateDoc(totalRef, {
                        totalArea: totalArea
                    });
                    alert("註冊成功！ 已發送驗證信！\n" + "請至 " + email.value + " 查看");
                    location.href = "./login.html";
                });

            })
            .catch((error) => {
                const errorMessage = error.message;
                console.log(errorMessage);
                alert("註冊失敗！信箱不符合格式或是帳號已被註冊");
            });
        }
    }
});


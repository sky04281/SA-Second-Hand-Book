<script setup>
    //firebase 
    import { auth } from "@/scripts/firebase/config.js";
    import { createUserWithEmailAndPassword } from "firebase/auth";

    import { ref, onMounted } from "vue";
    //component
    import MaterialInput from "@/components/MaterialInput.vue";

    const email = ref("");
    const password = ref("");

    function signUp(){
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                window.location = "/";
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
            });
    }

    import setMaterialInput from "@/assets/js/material-input";
        onMounted(() => {
            setMaterialInput();
        });
</script>

<template>
    <br>
    <MaterialInput
        id="email"
        class="input-group-outline"
        :label="{ text: '信箱', class: 'form-label' }"
        type="text"
        v-model.lazy="email"
    />
    <br>
    <MaterialInput
        id="password"
        class="input-group-outline"
        :label="{ text: '密碼', class: 'form-label' }"
        type="text"
        v-model.lazy="password"
    />
    <br>
    <input type="button" value="註冊" @click="signUp">

</template>
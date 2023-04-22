<script setup>
    //firebase 
    import { auth } from "@/scripts/firebase/config.js";
    import { createUserWithEmailAndPassword } from "firebase/auth";

    import { ref, onMounted } from "vue";
    import { useRouter } from "vue-router";
    //component
    import MaterialInput from "@/components/MaterialInput.vue";

    var email = ref("");
    var password = ref("");
    const router = useRouter();

    function signUp(){
        createUserWithEmailAndPassword(auth, email.value, password.value)
        .then(() => {
            email.value = "";
            password.value = "";
            router.push({name: "presentation"});
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
        v-model="email"
    />
    <br>
    <MaterialInput
        id="password"
        class="input-group-outline"
        :label="{ text: '密碼', class: 'form-label' }"
        type="text"
        v-model="password"
    />
    <br>
    <input type="button" value="註冊" @click="signUp">
</template>
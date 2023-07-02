<script setup>
import { reactive, ref } from "vue";
import { Eleme } from "@element-plus/icons-vue";
import { userLogin } from "@/network/login.js";

let loginBtnLoading = ref(false)

// 登录信息
const loginForm = reactive({
    username: "admin",
    password: "yxAlFXQ&EL6!sxQ"
})

// 登录表单内验证信息
const loginRules = reactive({
    username: [
        { required: true, message: 'Please input Username', trigger: 'change'},
    ],
    password: [
        { required: true, message: 'Please input Password', trigger: 'change'},
    ],
})

// 请求登录API
function login(loginForm) {
    // 点击login后显示loading图标
    loginBtnLoading.value = true
    setTimeout(() => {loginBtnLoading.value = false}, 5000)
    // login axios
    userLogin(loginForm.username, loginForm.password).then(result => {console.log(result)})
}
</script>

<template>
    <div class="container">
        <el-form :model="loginForm" label-width="70px" class="loginForm" :rules="loginRules" :label-position="'top'">
            <el-form-item label="账号:" prop="username">
                <el-input clearable v-model="loginForm.username" placeholder="请输入用户名" />
            </el-form-item>
            <el-form-item label="密码:" prop="password">
                <el-input type="password" v-model="loginForm.password" placeholder="请输入密码" show-password />
            </el-form-item>
            <el-form-item>
<!--                <el-button type="default" plain size="large" disabled auto-insert-space>注册</el-button>-->
                <el-button type="primary" plain size="large" @click="login(loginForm)" auto-insert-space
                           :loading-icon="Eleme" :loading="loginBtnLoading">登录</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<style lang="scss" scoped>
div.container {
    // color
    //background: #ffffff;

    // container center
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    // border
    border: 1px solid #68a3c5;
    border-radius: 30px;
}

.loginForm {
    margin: 20px;
}

.el-input {
    min-width: 220px;
}

.el-button {
    //width: 47%;
    width: 100%;
}

</style>

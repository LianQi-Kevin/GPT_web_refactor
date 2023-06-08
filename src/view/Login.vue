<script setup>
import { reactive } from "vue";

// 登录信息
const loginForm = reactive({
    userName: "username",
    password: "password"
})

// 请求登录API
function login(loginForm) {
    console.log(loginForm.userName, loginForm.password)
}

</script>
<template>
    <div class="container">
        <el-form :model="loginForm" label-width="70px" class="loginForm">
            <el-form-item label="账 号">
                <el-input clearable v-model="loginForm.userName" placeholder="请输入用户名"/>
            </el-form-item>
            <el-form-item label="密 码">
                <el-input type="password" v-model="loginForm.password"
                          placeholder="请输入密码" show-password/>
            </el-form-item>
            <el-form-item>
                <el-button type="default" plain size="large" disabled auto-insert-space>注册</el-button>
                <el-button type="primary" plain size="large" @click="login(loginForm)" auto-insert-space>登录</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<style lang="scss">
div.container {
    // color
    background: #ffffff;

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
    width: 47%;
}

</style>

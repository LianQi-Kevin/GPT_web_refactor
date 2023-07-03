<script setup>
import {useRouter} from "vue-router";
import {refreshToken} from "@/network/login.js";
const router = useRouter()
</script>

<template>
    <div class="container">
        <h1>Home</h1>
        <el-button-group>
            <el-button @click="() => {router.push('login')}" size="large">To Login</el-button>
            <el-button @click="() => {router.push('chat')}" size="large">To AzureChatGPT</el-button>
            <el-button @click="() => {router.push('/error/404')}" size="large">To 404NotFound</el-button>
            <el-button @click="() => {refreshToken().then(r => {console.debug(r)})}" size="large">Verify refreshToken</el-button>
        </el-button-group>
    </div>
</template>

<style scoped lang="scss">
.container {
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
.el-button {
    margin: 5px 0;
}
</style>
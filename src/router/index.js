import {createRouter, createWebHistory} from "vue-router";
import routes from "@/router/routes.js";
import {refreshToken} from "@/network/login.js";
import {getLocalStorage} from "@/storageUtils/localStorage.js";
import {getCookie} from "@/storageUtils/cookies.js";
import {ElMessage} from "element-plus";

// 创建路由
const router = createRouter({
    history: createWebHistory(),
    routes: routes,
});

// router.beforeEach 全局前置守卫, 导航开始前执行
router.beforeEach((to, from, next) => {
    // 前置鉴权
    if (to.meta['requiresAuth']) {
        // 获取refresh token
        if (getLocalStorage('refresh_token') !== null) {
            const accessToken = getCookie('jwt_token')
            if (accessToken === null) {
                refreshToken().then(result => {
                    console.log(result)
                })
            }
            next()
        } else {
            ElMessage({
                type: 'error',
                message: 'Login invalid, Please login again!',
                duration: 3000
            })
            next('/login')
        }
    } else {
        next(); // 无需鉴权, 直接放行
    }
})

// 根据meta.title修改页面标题
// router.afterEach 全局后置守卫, 导航结束后执行
router.afterEach((to, from) => {
    // 如果routes的meta中定义了title，则修改页面title
    if (to.meta['title']) {
        document.title = to.meta['title'];
    }
});

export default router
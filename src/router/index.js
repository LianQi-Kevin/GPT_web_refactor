import {createRouter, createWebHistory} from "vue-router";
import routes from "@/router/routes.js";
import {refreshToken} from "@/network/login.js";
import {getUserInfo} from "@/network/account.js";
import {ElMessage} from "element-plus";
import {getCookie} from "@/storageUtils/cookies.js";

// 创建路由
const router = createRouter({
    history: createWebHistory(),
    routes: routes,
});

// router.beforeEach 全局前置守卫, 导航开始前执行
router.beforeEach( (to, from, next) => {
    if (process.env.NODE_ENV !== "development") {
        // 前置鉴权
        if (to.meta['requiresAuth']) {
                // 获取refresh token
                refreshToken().then(async result => {
                    if (result.type === 'success') {
                        // 如果存在用户组限制，则进行用户组校验
                        if (to.meta['role_group'] !== undefined) {
                            const userInfo = await getUserInfo(getCookie("jwt_token"))
                            if (to.meta['role_group'].includes(userInfo.value.role)) {
                                next()
                            } else {
                                ElMessage({
                                    type: 'error',
                                    message: '您没有权限访问此页面，请联系服务器管理员',
                                    duration: 5000,
                                    showClose: true
                                })
                                // 阻止进一步跳转
                                next(false)
                            }
                        } else {
                            next()
                        }
                    } else {
                        // refresh token校验失败
                        ElMessage({
                            type: 'error',
                            message: result.msg,
                            duration: 5000,
                            showClose: true
                        })
                        next('/login')
                    }
                })
            } else {
                // 无需鉴权, 直接放行
                next();
            }
    } else {
        next(); // 如果是开发环境，则直接放行
    }
})

// 根据meta.title修改页面标题
// router.afterEach 全局后置守卫, 导航结束后执行
router.afterEach((to) => {
    // 如果routes的meta中定义了title，则修改页面title
    if (to.meta['title']) {
        document.title = to.meta['title'];
    }
});

export default router
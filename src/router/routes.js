const routes = [
    {
        path: '/login',
        name: 'Login',
        // 使用import语句对页面启用lazyLoad
        component: () => import('@/view/Login.vue'),
        meta: {
            requiresAuth: false,
            title: 'Login'
        }
    },
    {
        path: '/chat',
        alias: '/',
        name: 'AzureChat',
        component: () => import('@/view/Chat.vue'),
        meta: {
            requiresAuth: true,
            title: 'ChatGPT'
        }
    },
    {
        // 配置全局匹配，跳转到Chat页
        path: '/:pathMatch(.*)*',
        redirect: '/login'
    }
];

export default routes
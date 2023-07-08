import Home from "@/view/Home.vue";

const routes = [
    {
        path: '/',
        alias: '/home',
        name: 'Home',
        component: Home,    // 首页不启用lazyLoad
        meta: {
            requiresAuth: false,    // 是否需要鉴权 ( 非必要, 默认false )
            title: 'Home'   // 页面标题 ( 非必要 )
        }
    },
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
        name: 'AzureChat',
        component: () => import('@/view/Chat.vue'),
        meta: {
            requiresAuth: true,
            title: 'ChatGPT'
        }
    },
    {
        path: '/error/:id',
        component: () => import('@/view/notFound.vue'),
        props: (route) => ({id: route.params.id || 404}),
        meta: {
            requiresAuth: false,
            title: 'ERROR'
        }
    },
    {
        // 配置全局匹配，跳转到 404 NOT FOUND
        path: '/:pathMatch(.*)*',
        redirect: '/error/404'
    }
];

export default routes
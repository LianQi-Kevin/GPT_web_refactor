import {createRouter, createWebHashHistory} from "vue-router";

const routes = [
    { path: '/', alias: '/login', name: 'login', component: () => import('@/view/Login.vue') },
    { path: '/chat', name: 'chat', component: () => import('@/view/Chat.vue') },
];

export default createRouter({
    history: createWebHashHistory(),
    routes: routes,
});
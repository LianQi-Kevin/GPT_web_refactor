import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import 'element-plus/theme-chalk/dark/css-vars.css'

const app = createApp(App);

// 绑定APP.vue到DOM
app.mount('#app');

import { createApp } from 'vue'
import App from './App.vue'
import 'vfonts/Lato.css'
// 等宽字体
import 'vfonts/FiraCode.css'
import router from "./routers";

createApp(App).use(router)
    .mount('#app')

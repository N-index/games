import { createApp } from 'vue'
import App from './App.vue'
import 'vfonts/Lato.css'
// 等宽字体
import 'vfonts/FiraCode.css'
import router from "./routers";



const b ='12345' ;
console.log(b);

createApp(App).use(router)
    .mount('#app')

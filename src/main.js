import { createApp } from "vue";
import App from "./App.vue";
import "vfonts/Lato.css";
import "vfonts/FiraCode.css";
import router from "./routers";

createApp(App).use(router).mount("#app");

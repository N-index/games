import { createApp } from "vue";
import App from "./App.vue";
import "vfonts/Lato.css";
import "vfonts/FiraCode.css";
import router from "./routers";
import { initFirebaseApp } from "./firebase/init";
export const firebaseApp = initFirebaseApp();
createApp(App).use(router).mount("#app");

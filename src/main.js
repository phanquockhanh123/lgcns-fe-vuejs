import "./assets/main.css";

import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import Antd from "ant-design-vue";
import VueNativeSock from "vue-native-websocket-vue3";


const pinia = createPinia();
const app = createApp(App);
app.use(router);

app.use(Antd);

app.use(pinia)

app.mount("#app");

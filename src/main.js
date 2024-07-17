import "./assets/main.css";

import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import Antd from "ant-design-vue";


const pinia = createPinia();
const app = createApp(App);
app.use(router);

app.use(Antd);

app.use(pinia)

app.mount("#app");

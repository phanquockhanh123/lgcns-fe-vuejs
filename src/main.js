import "./assets/main.css";

import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import Antd from "ant-design-vue";
import VueNativeSock from "vue-native-websocket-vue3";
const app = createApp(App);
app.use(VueNativeSock, "ws://localhost:8081/ws", {
  reconnection: true,
  format: "json",
});
app.use(router);

app.use(Antd);

app.mount("#app");

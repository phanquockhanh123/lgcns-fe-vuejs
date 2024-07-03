import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import Antd from 'ant-design-vue';
import { connect } from './utils/ws';

connect()
const app = createApp(App)

app.use(router)

app.use(Antd)

app.mount('#app')

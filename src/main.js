import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { Button, message, Drawer, Avatar, Layout, Menu, Breadcrumb, Table, Card, Tag, Space, Form, Row, Col, Input, Select, DatePicker, Checkbox, Popover, Tooltip, Carousel, Image, Pagination, Textarea, Dropdown } from 'ant-design-vue'

const app = createApp(App)

app.use(router)

app.use(Form)
app.use(Dropdown)
app.use(Textarea)
app.use(Pagination)
app.use(Image)
app.use(Carousel)
app.use(Tooltip)
app.use(Popover)
app.use(Checkbox)
app.use(Row)
app.use(Col)
app.use(Input)
app.use(Select)
app.use(DatePicker)
app.use(Button)
app.use(Space)
app.use(Tag)
app.use(Card)
app.use(Table)
app.use(Drawer)
app.use(Avatar)
app.use(Layout)
app.use(Menu)
app.use(Breadcrumb)

app.mount('#app')

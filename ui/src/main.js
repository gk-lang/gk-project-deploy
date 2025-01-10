import "vue/jsx";
import { createApp } from "vue";
import App from "./App.vue";

// @use "element-plus/theme-chalk/dark/css-vars.css";
// @use "./var.css";

import "./styles/index.scss";


// 引入状态管理
import { setupStore } from "@/store";
// 引入element-plus
import { setupElementPlus } from "@/plugins/element-plus";
// 引入element-plus
import { setupDynamicWidget } from "@/plugins/dynamic-widget";
// 路由
import { setupRouter } from "./router";
// 指令
import { setupDirectives } from "./directives";
// 路由钩子
import "./permission";

import vContextmenu from 'v-contextmenu'
import 'v-contextmenu/dist/themes/default.css'

// 创建实例
const setupAll = async () => {
  const app = createApp(App);

  setupStore(app);

  setupElementPlus(app);

  setupDynamicWidget(app);

  setupRouter(app);

  setupDirectives(app);
  
  app.use(vContextmenu);
  app.mount("#app");
};

setupAll();

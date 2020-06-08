// The Vue build version to load with the `import` command
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import Usersearch from "@/components/Usersearch.vue";
import Userlist from "@/components/Userlist.vue";
// import "./plugins/element.js";
// import { Button } from "element-ui";

Vue.config.productionTip = false;
Vue.use(ElementUI);
Vue.component("user", Usersearch);
Vue.component("userlist", Userlist);

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount("#app");

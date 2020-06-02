import Vue from "vue";
//import App from "./App.vue";
//import Contacts from "./components/Contacts"
import Usersearch from "./components/Usersearch"
//import Addmember from "./components/Addmember"
import Userlist from "./components/Userlist"
import Setgroup from "./components/Setgroup"
import router from "./router";
import store from "./store";
import "./plugins/element.js";
import ElementUI from "element-ui";

Vue.config.productionTip = false;
Vue.use(ElementUI);
Vue.use(router);
Vue.component('user',Usersearch);
Vue.component('list',Userlist);


new Vue({
  router,
  store,
  render: (h) => h(Setgroup),
}).$mount("#app");

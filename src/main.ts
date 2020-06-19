// The Vue build version to load with the `import` command
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import vuescroll from "vuescroll";

Vue.config.productionTip = false;
Vue.use(ElementUI);
Vue.use(vuescroll, {
  ops: {
    rail: {
      gutterOfEnds: "5px",
      gutterOfSide: "5px",
    },
    bar: { background: "#409eff" },
  },
  name: "vueScroll",
});

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount("#app");

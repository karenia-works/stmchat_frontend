import Vue from "vue";
import Router from "vue-router";
import Login from "@/components/Login";
import Regist from "@/components/Register";
import Addmember from "@/components/Addmember";
import Setgroup from "@/components/Setgroup";
import Contacts from "@/components/Contacts";
import Chat from "@/components/Chat";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/Login",
      name: "Login",
      component: Login,
    },
    {
      path: "/Regist",
      name: "Regist",
      component: Regist,
    },
    {
      path: "/Addmember",
      name: "Addmember",
      component: Addmember,
    },
    {
      path: "/Setgroup",
      name: "Setgroup",
      component: Setgroup,
    },
    {
      path: "/Contacts",
      name: "Contacts",
      component: Contacts,
    },
    {
      path: "/chat",
      component: Chat,
    },
  ],
});

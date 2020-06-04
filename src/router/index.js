import Vue from "vue";
import VueRouter from "vue-router";
import Login from "@/components/Login";
import Regist from "@/components/Register";
import Addmember from "@/components/Addmember";
import Setgroup from "@/components/Setgroup";
import Contacts from "@/components/Contacts";
import Chat from "@/components/Chat";
import ChatList from "@/components/ChatList";

Vue.use(VueRouter);

const routes = [
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
  {
    path: "/chatlist",
    component: ChatList,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;

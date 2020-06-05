import Vue from "vue";
import VueRouter from "vue-router";
import Login from "@/components/Login.vue";
import Regist from "@/components/Register.vue";
import Addmember from "@/components/Addmember.vue";
import Setgroup from "@/components/Setgroup.vue";
import Contacts from "@/components/Contacts.vue";
import Chat from "@/components/Chat.vue";
import ChatList from "@/components/ChatList.vue";

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
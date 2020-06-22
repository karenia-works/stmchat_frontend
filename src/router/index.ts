import Vue from "vue";
import VueRouter from "vue-router";
import Login from "@/components/Login.vue";
import Regist from "@/components/Register.vue";
import Addmember from "@/components/Addmember.vue";
import Setgroup from "@/components/Setgroup.vue";
import Contacts from "@/components/Contacts.vue";
import Chat from "@/components/Chat.vue";
import ChatList from "@/components/ChatList.vue";
import Setting from "@/components/Setting.vue";
import Groupinf from "@/components/Groupinf.vue";
import STM_Chat from "@/components/STM_Chat.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/STM-Chat",
    name: "stm main page",
    component: STM_Chat,
  },
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
  {
    path: "/setting",
    component: Setting,
  },
  {
    path: "/Groupinf",
    component: Groupinf,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;

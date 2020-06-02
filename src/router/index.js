import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Addmember from "../components/Addmember"
import Setgroup from "../components/Setgroup"
Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
  	  path:"/Addmember",
	  name:"Addmember",
	  component:Addmember
	  //component: () => import(/* webpackChunkName: "about" */ '../components/Addmember.vue')
  },
   {
  	  path:"/Setgroup",
	  name:"Setgroup",
	  component:Setgroup
	  //component: () => import(/* webpackChunkName: "about" */ '../components/Addmember.vue')
  },
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue")
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
	
});

export default router;

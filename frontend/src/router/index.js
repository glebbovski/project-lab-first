import Vue from "vue";
import VueRouter from "vue-router";
import HomeView from "../views/HomeView.vue";
import Auth from "../components/pages/Auth.vue"
import Courses from "../components/pages/Courses.vue"
import Register from "../components/pages/Register.vue"
import About from "../components/pages/About.vue"
import Course from "../components/pages/Course.vue"
import ChatPreview from "../components/pages/ChatPreview.vue";
import ChatRoom from "../components/pages/ChatRoom.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/about",
    name: "about",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    // component: () =>
    //   import(/* webpackChunkName: "about" */ "../views/AboutView.vue"),
    component: About
  },
  {
    path: "/login",
    name: "auth",
    component: Auth
  },
  {
    path: "/register",
    name: "register-page",
    component: Register
  },
  {
    path: "/mathematics",
    name: "math",
    component: Course
  },
  {
    path: "/programming",
    name: "promgramming",
    component: Course
  },
  {
    path: "/chemistry",
    name: "chemistry",
    component: Course
  },
  {
    path: "/music",
    name: "music",
    component: Course
  },
  {
    path: "/chat-preview",
    name: "chatpreview",
    component: ChatPreview
  },
  {
    path: "/websocket-chat",
    name: "chatroom",
    component: ChatRoom
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  document.title = to.name.charAt(0).toUpperCase() + to.name.slice(1);
  next();
});

export default router;

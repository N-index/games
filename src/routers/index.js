import { createWebHashHistory, createRouter } from "vue-router";

const routes = [
  {
    path: "/",
    redirect: "/home",
  },
  {
    path: "/home",
    component: () => import("../views/Home"),
  },
  {
    path: "/hungry-snake",
    component: () => import("../views/HungrySnake"),
  },
  {
    path: "/insert-needle",
    component: () => import("../views/InsertNeedle"),
  },
  {
    path: "/russian-square",
    component: () => import("../views/RussianSquare"),
  },
];
const router = createRouter({
  history: createWebHashHistory(),
  routes,
});
export default router;

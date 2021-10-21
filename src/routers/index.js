import Home from "../views/Home";
import HungrySnake from "../views/HungrySnake";
import InsertNeedle from "../views/InsertNeedle";
import RussianSquare from "../views/RussianSquare";
import { createWebHashHistory, createRouter } from "vue-router";

const routes = [
  { path: "/home", component: Home },
  { path: "/hungry-snake", component: HungrySnake },
  { path: "/insert-needle", component: InsertNeedle },
  { path: "/russian-square", component: RussianSquare },
];
const router = createRouter({
  history: createWebHashHistory(),
  routes,
});
export default router;

import { createRouter, createWebHistory } from "vue-router";
import ResumeView from "../views/ResumeView.vue";
import EditorView from "../views/EditorView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "resume",
      component: ResumeView,
    },
    {
      path: "/edit",
      name: "editor",
      component: EditorView,
    },
  ],
});

export default router;

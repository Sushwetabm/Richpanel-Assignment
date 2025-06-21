import { createRouter, createWebHistory } from "vue-router";
import AuthView from "@/views/AuthView.vue";
import DashboardView from "@/views/DashboardView.vue";
import FacebookIntegrationView from "@/views/FacebookIntegrationView.vue";
import { useAuthStore } from "@/stores/auth";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      redirect: "/dashboard",
    },
    {
      path: "/login",
      name: "login",
      component: AuthView,
      meta: { requiresAuth: false },
    },
    {
      path: "/register",
      name: "register",
      component: AuthView,
      meta: { requiresAuth: false },
    },
    {
      path: "/dashboard",
      name: "dashboard",
      component: DashboardView,
      meta: { requiresAuth: true },
    },
    {
      path: "/facebook-integration",
      name: "facebook-integration",
      component: FacebookIntegrationView,
      meta: { requiresAuth: true },
    },
    {
      path: "/:pathMatch(.*)*",
      redirect: "/dashboard",
    },
  ],
});

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next("/login");
  } else if (!to.meta.requiresAuth && authStore.isAuthenticated) {
    next("/dashboard");
  } else {
    next();
  }
});

export default router;

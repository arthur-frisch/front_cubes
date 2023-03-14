const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    meta: { requiredAuth: true },
  },
  {
    path: "/login",
    component: () => import("pages/LoginPage.vue"),
  },
  {
    path: "/records",
    component: () => import("pages/RaspberryRecords.vue"),
    meta: { requiredAuth: true },
  },
  {
    path: "/dashboard",
    component: () => import("pages/DashboardPage.vue"),
    meta: { requiredAuth: true },
  },
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;

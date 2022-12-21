const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("pages/StorePage.vue") },
      { path: "/store", component: () => import("pages/StorePage.vue") },
      { path: "/dapps", component: () => import("pages/DappsPage.vue") },
      {
        path: "/details/:id",
        component: () => import("pages/DetailsPage.vue"),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("pages/ErrorNotFound.vue") },
    ],
  },
];

export default routes;

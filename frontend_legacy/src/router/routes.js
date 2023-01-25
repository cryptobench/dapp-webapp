const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("pages/IndexPage.vue") },
      { path: "/store", component: () => import("pages/StorePage.vue") },
      { path: "/dapps", component: () => import("pages/DappsPage.vue") },
      {
        path: "/terms-and-conditions",
        component: () => import("pages/TermsAndConditions.vue"),
      },
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

import { createRouter, createWebHashHistory } from "vue-router";
import { Layout, LayoutPortal, getParentLayout } from "@/utils/routerHelper";

export const whitelistedRoute = ["/login", "/register","/forgot-password", /^\/portal(\/.*)?$/];

export const portalRouterMap = [
  {
    path: "/",
    redirect: "/Portal/Home",
    name: "PortalRoot",
    meta: {
      hidden: true,
      breadcrumb: false,
    },
  },
  {
    path: "/Portal",
    name: "Portal",
    component: LayoutPortal,
    redirect: "/Portal/Home",
    meta: {},
    children: [
      {
        path: "Home",
        name: "Home",
        component: () => import("@/views/Portal/Home/Home.vue"),
        meta: {
          title: "首页",
          icon: "vi-cib:telegram-plane",
        },
      },
      {
        path: "Api",
        name: "Api",
        component: () => import("@/views/Portal/Api/Api.vue"),
        meta: {
          title: "接口文档",
          icon: "vi-cib:telegram-plane",
        },
      },
    ],
  },
];

export const constantRouterMap = [
  {
    path: "/Redirect",
    component: Layout,
    name: "Redirect",
    children: [
      {
        path: "/Redirect/:path(.*)",
        name: "Redirect2",
        component: () => import("@/views/Redirect/Redirect.vue"),
        meta: {},
      },
    ],
    meta: {
      hidden: true,
      noTagsView: true,
    },
  },
  {
    path: "/Login",
    component: () => import("@/views/Login/Login.vue"),
    name: "Login",
    meta: {
      hidden: true,
      title: "登录",
      noTagsView: true,
    },
  },
  {
    path: "/register",
    component: () => import("@/views/register/index.vue"),
    name: "register",
    meta: {
      hidden: true,
      title: "注册",
      noTagsView: true,
    },
  },
  {
    path: "/forgot-password",
    component: () => import("@/views/forgot-password/index.vue"),
    name: "forgot-password",
    meta: {
      hidden: true,
      title: "忘记密码",
      noTagsView: true,
    },
  },
  {
    path: "/Personal",
    component: Layout,
    redirect: "/Personal/PersonalCenter",
    name: "Personal",
    meta: {
      title: "个人中心",
      hidden: true,
      canTo: true,
    },
    children: [
      {
        name: "PersonalCenter",
        path: "PersonalCenter",
        component: () =>
          import("@/views/Personal/PersonalCenter/PersonalCenter.vue"),
        meta: {
          title: "个人中心",
          hidden: true,
          canTo: true,
        },
      },
    ],
  },
  {
    path: "/404",
    component: () => import("@/views/Error/404.vue"),
    name: "NoFind",
    meta: {
      hidden: true,
      title: "404",
      noTagsView: true,
    },
  },
];

export const asyncRouterMap = [
  {
    path: "/admin",
    redirect: "/admin/index",
    component: Layout,
    meta: {},
    children: [
      {
        path: "index",
        component: () => import("@/views/demo/index.vue"),
        name: "HSBall4",
        meta: {
          title: "构建列表",
          icon: "vi-cib:telegram-plane",
        },
      },
    ],
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  strict: true,
  routes: [...portalRouterMap, ...constantRouterMap],
  scrollBehavior: () => ({ left: 0, top: 0 }),
});

// export const resetRouter = () => {
//   router.getRoutes().forEach((route) => {
//     const { name } = route;
//     if (name && !NO_RESET_WHITE_LIST.includes(name)) {
//       router.hasRoute(name) && router.removeRoute(name);
//     }
//   });
// };

export const setupRouter = (app) => {
  app.use(router);
};

export default router;

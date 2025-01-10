import router, { whitelistedRoute } from "./router";

import { useTitle } from "@/hooks/web/useTitle";
import { useNProgress } from "@/hooks/web/useNProgress";
import { usePageLoading } from "@/hooks/web/usePageLoading";

import { useAppStoreWithOut } from "@/store/modules/app";
import { usePermissionStoreWithOut } from "@/store/modules/permission";
import { useUserStoreWithOut } from "@/store/modules/user";

import { isRouteWhitelisted } from "@/utils/validate";

const { start, done } = useNProgress();

const { loadStart, loadDone } = usePageLoading();

router.beforeEach(async (to, from, next) => {
  start();
  loadStart();
  const permissionStore = usePermissionStoreWithOut();
  const appStore = useAppStoreWithOut();
  const userStore = useUserStoreWithOut();
  const toPath = to.path.toLocaleLowerCase();
  const isWhitelistedRoute = isRouteWhitelisted(whitelistedRoute, toPath);
  if (isWhitelistedRoute) {
    next();
  } else {
    if (userStore.getUserInfo) {
      if (to.path === "/login") {
        next({ path: "/admin" });
      } else {
        if (permissionStore.getIsAddRouters) {
          next();
          return;
        }

        // 开发者可根据实际情况进行修改
        const roleRouters = userStore.getRoleRouters || [];
        // 是否使用动态路由
        if (appStore.getDynamicRouter) {
          if (appStore.serverDynamicRouter) {
            await permissionStore.generateRoutes("server", roleRouters);
          } else {
            await permissionStore.generateRoutes("frontEnd", roleRouters);
          }
        } else {
          await permissionStore.generateRoutes("static");
        }

        permissionStore.getAddRouters.forEach((route) => {
          router.addRoute(route); // 动态添加可访问路由表
        });
        const redirectPath = from.query.redirect || to.path;
        const redirect = decodeURIComponent(redirectPath);
        const nextData =
          to.path === redirect ? { ...to, replace: true } : { path: redirect };
        permissionStore.setIsAddRouters(true);
        next(nextData);
      }
    } else {
      next(`/login?redirect=${to.path}`); // 否则全部重定向到登录页
    }
  }
});

router.afterEach((to) => {
  useTitle(to?.meta?.title);
  done(); // 结束Progress
  loadDone();
});

<script lang="jsx">
import { useRouter } from "vue-router";
import { filterBreadcrumb } from "./helper";
import {
  ref,
  watch,
  computed,
  unref,
  defineComponent,
  TransitionGroup,
} from "vue";
import { ElBreadcrumb, ElBreadcrumbItem } from "element-plus";
import { filter, treeToList } from "@/utils/tree";
// import { Icon } from '@/components/Icon'
import { useAppStore } from "@/store/modules/app";
import { usePermissionStore } from "@/store/modules/permission";
const appStore = useAppStore();

// 面包屑图标
const breadcrumbIcon = computed(() => appStore.getBreadcrumbIcon);

export default defineComponent({
  name: "Breadcrumb",
  setup() {
    const { currentRoute } = useRouter();
    const levelList = ref([]);

    const permissionStore = usePermissionStore();

    const menuRouters = computed(() => {
      const routers = permissionStore.getRouters;
      return filterBreadcrumb(routers);
    });

    const getBreadcrumb = () => {
      const currentPath = currentRoute.value.matched.slice(-1)[0].path;
      levelList.value = filter(unref(menuRouters), (node) => {
        return node.path === currentPath;
      });
    };

    const renderBreadcrumb = () => {
      const breadcrumbList = treeToList(unref(levelList));
      return breadcrumbList.map((v) => {
        const disabled = !v.redirect || v.redirect === "noredirect";
        const meta = v.meta;
        return (
          <ElBreadcrumbItem to={{ path: disabled ? "" : v.path }} key={v.name}>
            {meta?.icon && breadcrumbIcon.value ? (
              <>
                {/* <Icon icon={meta.icon} ></Icon> {t(v?.meta?.title || '')} */}
                {v?.meta?.title || ""}
              </>
            ) : (
              v?.meta?.title || ""
            )}
          </ElBreadcrumbItem>
        );
      });
    };

    watch(
      () => currentRoute.value,
      (route) => {
        if (route.path.startsWith("/redirect/")) {
          return;
        }
        getBreadcrumb();
      },
      {
        immediate: true,
      }
    );

    return () => (
      <ElBreadcrumb separator="/">
        {/* <TransitionGroup appear enter-active-class="animate__animated animate__fadeInRight">
          {renderBreadcrumb()}
        </TransitionGroup> */}
        {renderBreadcrumb()}
      </ElBreadcrumb>
    );
  },
});
</script>

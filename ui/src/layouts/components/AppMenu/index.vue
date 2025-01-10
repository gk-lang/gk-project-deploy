<script lang="jsx">
import { computed, defineComponent, unref } from "vue";
import { ElMenu, ElScrollbar } from "element-plus";
import { useAppStore } from "@/store/modules/app";
import { usePermissionStore } from "@/store/modules/permission";
import { useRenderMenuItem } from "./components/useRenderMenuItem";
import { useRouter } from "vue-router";
import { isUrl } from "@/utils/is";
import { useDesign } from "@/hooks/web/useDesign";

const { getPrefixCls } = useDesign();

const prefixCls = getPrefixCls("menu");

export default defineComponent({
  name: "Menu",
  props: {
    menuSelect: {
      type: Function,
      default: undefined,
    },
  },
  setup(props) {
    const router = useRouter();
    const appStore = useAppStore();
    const permissionStore = usePermissionStore();

    const layout = computed(() => appStore.getLayout);

    const menuMode = computed(() => {
      // 竖
      // const vertical = ["classic", "topLeft", "cutMenu"];

      // if (vertical.includes(unref(layout))) {
      //   return "vertical";
      // } else {
      //   return "horizontal";
      // }
      return 'vertical'
    });

    const routers = computed(() =>
      unref(layout) === "cutMenu"
        ? permissionStore.getMenuTabRouters
        : permissionStore.getRouters
    );

    const collapse = computed(() => appStore.getCollapse);

    const uniqueOpened = computed(() => appStore.getUniqueOpened);

    const activeMenu = computed(() => {
      const { meta, path } = unref(router.currentRoute);
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu;
      }
      return path;
    });

    const menuSelect = (index) => {
      if (props.menuSelect) {
        props.menuSelect(index);
      }
      // 自定义事件
      if (isUrl(index)) {
        window.open(index);
      } else {
        router.push(index);
      }
    };

    const renderMenu = () => {
      return (
        <ElMenu
          defaultActive={unref(activeMenu)}
          mode={unref(menuMode)}
          collapse={
            unref(layout) === "top" || unref(layout) === "cutMenu"
              ? false
              : unref(collapse)
          }
          uniqueOpened={unref(layout) === "top" ? false : unref(uniqueOpened)}
          onSelect={menuSelect}
        >
          {{
            default: () => {
              const { renderMenuItem } = useRenderMenuItem();
              return renderMenuItem(unref(routers));
            },
          }}
        </ElMenu>
      );
    };

    return () => renderMenu();
  },
});
</script>
<style lang="scss" scoped>
:deep(.el-menu) {
  border-right: 0;
  .el-menu-item,
  .el-sub-menu__title {
    height: var(--el-menu-item-height);
    margin: 0 10px 5px;
    overflow: hidden;
    line-height: var(--el-menu-item-height);
    text-overflow: ellipsis;
    white-space: nowrap;
    border-radius: var(--el-border-radius-base);
    &:hover,
    &.is-active {
      color: var(--el-color-white);
      background-color: var(--el-color-primary);
    }
  }
}
</style>

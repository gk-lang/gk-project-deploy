<template>
  <div class="portal-header-menu">
    <div
      class="tag"
      v-for="tab in menuTabList"
      :style="{ width: tab.width }"
      @click="handleMainMenuItemClick(tab)"
    >
      <el-dropdown
        :hide-on-click="false"
        v-if="tab.children && tab.children.length"
      >
        <span class="el-dropdown-link">
          {{ tab.title }}
        </span>
        <template #dropdown>
          <ElScrollbar>
            <div class="ft-nav-develop-container">
              <div class="develop-type" v-for="menuItem in tab.children">
                <div class="name">{{ menuItem.title }}</div>
                <div class="develop-item-wrapper">
                  <div
                    @click="handleSubMenuItemClick(subMenuItem, menuItem, tab)"
                    class="develop-item"
                    v-for="subMenuItem in menuItem.children"
                  >
                    {{ subMenuItem.title }}
                  </div>
                </div>
              </div>
            </div>
          </ElScrollbar>
        </template>
      </el-dropdown>
      <span v-else class="el-dropdown-link">{{ tab.title }}</span>
      <div v-show="tab.isSelected" class="nav-underline"></div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import {
  ElDropdown,
  ElDropdownMenu,
  ElDropdownItem,
  ElScrollbar,
} from "element-plus";
import { findPathAll, findPath } from "@/utils/tree.js";
const router = useRouter();
const currentRoute = router.currentRoute;
const menuTabList = ref([
  {
    title: "首页",
    width: "60px",
    name: "home",
    isSelected: true,
  },
  {
    title: "开发文档",
    width: "70px",
    name: "api",
    isSelected: false,
    children: [
      {
        title: "地址服务1",
        name: "api_1",
        children: [
          {
            title: "地址级别判断1",
            path: "/portal/test1",
            name: "test1",
          },
          {
            title: "地址级别判断2",
            path: "/portal/test2",
            name: "test2",
          },
          {
            title: "地址级别判断3",
            path: "/portal/test3",
            name: "test3",
          },
          {
            title: "地址级别判断4",
            path: "/portal/test4",
            name: "test4",
          },
          {
            title: "地址级别判断5",
            path: "/portal/test5",
            name: "test5",
          },
          {
            title: "地址级别判断6",
            path: "/portal/test6",
            name: "test6",
          },
          {
            title: "地址级别判断7",
            path: "/portal/test7",
            name: "test7",
          },
          {
            title: "地址级别判断8",
            path: "/portal/test8",
            name: "test8",
          },
        ],
      },
      {
        title: "地址服务2",
        name: "api_2",
        children: [
          {
            title: "地址级别判断1",
            path: "/portal/test1",
            name: "test1",
          },
          {
            title: "地址级别判断2",
            path: "/portal/test2",
            name: "test2",
          },
          {
            title: "地址级别判断3",
            path: "/portal/test3",
            name: "test3",
          },
          {
            title: "地址级别判断4",
            path: "/portal/test4",
            name: "test4",
          },
        ],
      },
    ],
  },
  {
    title: "解决方案",
    width: "70px",
    name: "solution",
    isSelected: false,
    children: [
      {
        title: "地址服务1",
        name: "solution_1",
        children: [
          {
            title: "地址级别判断1",
            path: "/portal/test1",
            name: "test1",
          },
          {
            title: "地址级别判断2",
            path: "/portal/test2",
            name: "test2",
          },
          {
            title: "地址级别判断3",
            path: "/portal/test3",
            name: "test3",
          },
          {
            title: "地址级别判断4",
            path: "/portal/test4",
            name: "test4",
          },
        ],
      },
      {
        title: "地址服务2",
        name: "solution_2",
        children: [
          {
            title: "地址级别判断1",
            path: "/portal/test1",
            name: "test1",
          },
          {
            title: "地址级别判断2",
            path: "/portal/test2",
            name: "test2",
          },
          {
            title: "地址级别判断3",
            path: "/portal/test3",
            name: "test3",
          },
          {
            title: "地址级别判断4",
            path: "/portal/test4",
            name: "test4",
          },
        ],
      },
    ],
  },
  {
    title: "服务与支持",
    width: "85px",
    name: "support",
    isSelected: false,
    children: [
      {
        title: "地址服务1",
        name: "support_1",
        children: [
          {
            title: "地址级别判断1",
            path: "/portal/test1",
            name: "test1",
          },
          {
            title: "地址级别判断2",
            path: "/portal/test2",
            name: "test2",
          },
          {
            title: "地址级别判断3",
            path: "/portal/test3",
            name: "test3",
          },
          {
            title: "地址级别判断4",
            path: "/portal/test4",
            name: "test4",
          },
        ],
      },
      {
        title: "地址服务2",
        name: "support_2",
        children: [
          {
            title: "地址级别判断1",
            path: "/portal/test1",
            name: "test1",
          },
          {
            title: "地址级别判断2",
            path: "/portal/test2",
            name: "test2",
          },
          {
            title: "地址级别判断3",
            path: "/portal/test3",
            name: "test3",
          },
          {
            title: "地址级别判断4",
            path: "/portal/test4",
            name: "test4",
          },
        ],
      },
    ],
  },
]);
function handleMainMenuItemClick(item) {
  if (!item.children?.length) {
    // menuTabList.value.forEach((x) => (x.isSelected = false));
    // item.isSelected = true;
    if (item.name === "home") {
      router.push("/portal/home");
    }
  }
}
function handleSubMenuItemClick(subMenuItem, menuItem, tab) {
  // const list = findPath(menuTabList.value, (x) => x.key === subMenuItem.key);
  // menuTabList.value.forEach((x) => (x.isSelected = false));
  // tab.isSelected = true;
  router.push("/portal/api");
}
function updateSelectedTab() {
  const routeName = currentRoute.value.name.toLocaleLowerCase();
  if (routeName === "home") {
    menuTabList.value.forEach((x) => (x.isSelected = false));
    menuTabList.value[0].isSelected = true;
  }
  if (routeName === "api") {
    menuTabList.value.forEach((x) => (x.isSelected = false));
    menuTabList.value[1].isSelected = true;
  }
}
watch(
  () => currentRoute.value,
  (nv) => {
    updateSelectedTab();
  }
);
onMounted(() => {
  updateSelectedTab();
});
</script>
<style lang="scss" scoped>
.portal-header-menu {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  width: 400px;
  .tag {
    position: relative;
    text-align: center;

    .nav-underline {
      width: 100%;
      position: absolute;
      bottom: 0;
      display: block;
      height: 3px;
      background-color: #ed0014;
      transition: all 0.2s ease-out;
    }
    .el-dropdown-link {
      font-size: 16px;
      cursor: pointer;
      outline: none !important;
      height: 56px;
      line-height: 56px;
      color: #222;
      &:hover {
        color: #2562ff;
        cursor: pointer;
      }
    }
    :deep(.el-dropdown) {
    }
  }
}
.ft-nav-develop-container {
  display: flex;
  margin: 16px 20px;
  .develop-type {
    .name {
      font-size: 14px;
      color: #222;
      line-height: 20px;
      border-bottom: 1px solid #d3d9e4;
      border-bottom-width: 1px;
      border-bottom-style: solid;
      border-bottom-color: rgb(211, 217, 228);
      padding-bottom: 10px;
      margin-bottom: 10px;
    }
    .develop-item-wrapper {
      height: 200px;
      display: grid;
      grid-auto-flow: column;
      gap: 10px;
      grid-template-rows: repeat(auto-fill, 24px);
      margin-right: 20px;
      .develop-item {
        padding-right: 10px;
        font-size: 14px;
        color: #222;
        line-height: 17px;
        margin-bottom: 16px;
        cursor: pointer;
      }
    }
  }
}
</style>

<template>
  <ElScrollbar class="service-tree-container">
    <div class="search-input"></div>
    <el-menu
      default-active="2"
      class="el-menu-vertical"
      :default-openeds="defaultOpeneds"
      @open="handleOpen"
      @close="handleClose"
    >
      <template v-for="item in menuList">
        <template v-if="item.children.length">
          <el-sub-menu :index="item.key">
            <template #title>
              <span>{{ item.title }}</span>
            </template>
            <template v-for="childItem in item.children">
              <template v-if="childItem.children">
                <el-sub-menu :index="childItem.key">
                  <template #title>{{ childItem.title }}</template>
                  <el-menu-item
                    v-for="cItem in childItem.children"
                    :index="cItem.key"
                    >{{ cItem.title }}</el-menu-item
                  >
                </el-sub-menu>
              </template>
              <template v-else>
                <el-menu-item :index="childItem.key">{{
                  childItem.title
                }}</el-menu-item>
              </template>
            </template>
          </el-sub-menu>
        </template>
        <template v-else>
          <el-menu-item :index="item.key">
            <span>{{ item.title }}</span>
          </el-menu-item>
        </template>
      </template>
    </el-menu>
  </ElScrollbar>
</template>
<script setup>
import { ref } from "vue";
import {
  ElForm,
  ElFormItem,
  ElRow,
  ElCol,
  ElInput,
  ElButton,
  ElScrollbar,
  ElCarousel,
  ElCarouselItem,
  ElMenu,
  ElMenuItem,
  ElSubMenu,
  ElIcon,
  ElAvatar,
  ElDropdown,
  ElDropdownMenu,
  ElDropdownItem,
} from "element-plus";
import { Download, ArrowDown } from "@element-plus/icons-vue";
const menuList = ref([
  {
    title: "速运API",
    key: "速运API",
    children: [
      {
        title: "通用寄件类",
        key: "通用寄件类",
        path: "",
      },
      {
        title: "注册推送类",
        key: "注册推送类",
        path: "",
      },
      {
        title: "服务查询类",
        key: "服务查询类",
        path: "",
      },
      {
        title: "终端驿站类",
        key: "终端驿站类",
        path: "",
      },
      {
        title: "会员权益类",
        key: "会员权益类",
        path: "",
      },
    ],
  },
  {
    title: "基础通用API",
    key: "基础通用API",
    children: [
      {
        title: "面单类接口",
        key: "面单类接口",
        path: "",
      },
    ],
  },
  {
    title: "冷运API",
    key: "冷运API",
    children: [
      {
        title: "冷运运输类",
        key: "冷运运输类",
        path: "",
      },
      {
        title: "冷运仓储类",
        key: "冷运仓储类",
        path: "",
      },
    ],
  },
  {
    title: "快运API",
    key: "快运API",
    children: [
      {
        title: "零担下单类",
        key: "零担下单类",
        path: "",
      },
      {
        title: "运单查询推送类",
        key: "运单查询推送类",
        path: "",
      },
    ],
  },
]);
const defaultOpeneds = ref(["速运API","基础通用API","冷运API","快运API"])
function handleOpen() {}
function handleClose() {}
</script>
<style lang="scss" scoped>
.service-tree-container {
//   width: 14rem;
//   max-height: calc(100vh - 88px);
//   min-height: calc(100vh - 640px);
//   background-color: #ebeef5;
//   overflow: hidden;
//   position: sticky;
//   left: 0;
//   top: 100px;

height: 100%;
  @mixin menu-style {
    --el-menu-item-height: 46px;
    --el-menu-text-color: #303133;
    --el-menu-hover-text-color: #409eff;
    // --el-menu-bg-color: #ebeef5;
    --el-menu-bg-color: #FFF;

    // --el-menu-hover-bg-color: #ebeef5;
    --el-menu-hover-bg-color: #FFF;
    --el-menu-sub-item-height: calc(var(--el-menu-item-height) - 6px);
    background-color: var(--el-menu-bg-color);
    border: 0px;
  }
  :deep(.el-menu) {
    @include menu-style();
    .el-sub-menu__title {
      font-weight: 600;
    }
    .el-menu-item {
      &:hover {
        color: var(--el-menu-hover-text-color);
      }
    }
    .el-sub-menu {
      @include menu-style();
      .el-sub-menu__title {
        font-weight: 600;
      }
      .el-menu-item {
        &:hover {
          color: var(--el-menu-hover-text-color);
        }
      }
    }
  }
}
</style>

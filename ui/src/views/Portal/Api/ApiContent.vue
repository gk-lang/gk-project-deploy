<template>
  <ElScrollbar class="service-content-container">
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="date" label="服务代码">
        <template #default="scope">
          <el-link type="danger" :underline="false">{{ scope.row.date }}</el-link>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="接口名称" />
      <el-table-column prop="address" label="描述" />
    </el-table>
  </ElScrollbar>
</template>
<script setup>
import { ref } from "vue";
import {
  ElTable,
  ElTableColumn,
  ElLink,
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
const tableData = [
  {
    date: "EXP_RECE_REGISTER_ROUTE",
    name: "路由注册接口",
    address: "向外提供路由注册功能",
  },
  {
    date: "EXP_RECE_REGISTER_WAYBILL_PICTURE",
    name: "图片注册及推送接口",
    address: "提供图片注册及推送的功能",
  },
  {
    date: "RoutePushService",
    name: "路由推送接口",
    address: "路由推送接口",
  },
  {
    date: "PushOrderState",
    name: "订单状态推送接口",
    address: "主动增量推动下单后订单状态",
  },
  {
    date: "EXP_RECE_WAYBILLS_FEE_PUSH",
    name: "清单运费推送接口",
    address: "提供清单运费推送功能",
  },
];
</script>
<style lang="scss" scoped>
.service-content-container {
  :deep(.el-table) {
    height: 100%;
  }
}
</style>

<template>
  <div class="deploy-list auto-container">
    <el-card shadow="never" class="search-bar">
      <DynamicForm
        :formItems="searchFormItems"
        v-model="searchFormData"
        @notify="handleDynamicFormNotify"
      />
    </el-card>
    <el-card shadow="never" class="btn-bar">
      <ButtonsBar
        :isShowFoldBtn="false"
        :showButtonNum="4"
        :buttons="tableButtons"
        @click="handleButtonsClick"
      />
    </el-card>
    <DynamicTable
      class="table-container"
      border
      :columns="tableColumns"
      v-model="tableData"
      v-model:page="tablePage"
      @notify="handleDynamicTableNotify"
    />
    <DialogAddOrEdit
      v-model:isShow="dialogAddOrEditIsShow"
      :editFormData="dialogAddOrEditData"
      @save="handleDialogAddOrEditSave"
    />
  </div>
</template>

<script setup>
import { ElCard } from "element-plus";
import DialogAddOrEdit from "./dialog-add-or-edit.vue";
import useBtnEventHandle from "./use-btn-event-handle.js";
import { searchFormItems, tableButtons, tableColumns } from "./json-config.jsx";

const handleObj = useBtnEventHandle({});
const {
  searchFormData,
  tableData,
  tablePage,
  dialogAddOrEditIsShow,
  dialogAddOrEditData,
  handleDialogAddOrEditSave,
} = handleObj;

// 处理搜索form表单按钮事件
function handleDynamicFormNotify(params) {
  if (params.clickedBtn) {
    handleObj[params.clickedBtn.eventKey](params.clickedBtn);
  }
}

// 处理表格工具栏按钮事件
function handleButtonsClick(event, item) {
  handleObj[item.eventKey](item);
}

// 处理表格分页或者表格内按钮事件
function handleDynamicTableNotify(params) {
  if (
    ["size-change", "current-change"].includes(params.eventType) &&
    params.page
  ) {
    handleObj.handlePageChange(params.page);
  }
  if (params.clickedBtn) {
    handleObj[params.clickedBtn.eventKey](params);
  }
  if (["selection-change"].includes(params.eventType)) {
    handleObj.selectionChange(params);
  }
}
</script>

<style lang="scss" scoped>
.deploy-list {
  height: var(--el-container-height);
  .table-container {
    height: calc(100% - 135px);
  }
}
.read-the-docs {
  color: #888;
}
:deep(.search-bar.el-card) {
  margin-bottom: 10px;
  .el-card__body {
    padding: 10px 0px;
  }
}
:deep(.btn-bar.el-card) {
  border-bottom-left-radius: 0px;
  border-bottom-right-radius: 0px;
  border-bottom: 0px;
  .el-card__body {
    padding: 10px;
  }
}
</style>

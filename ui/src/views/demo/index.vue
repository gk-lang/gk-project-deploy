<template>
  <div class="demo2 auto-container">
    <el-card shadow="never" class="search-bar">
      <DynamicForm
        :formItems="formItems"
        v-model="formData"
        @notify="handleDynamicFormNotify"
      />
    </el-card>
    <el-card shadow="never" class="btn-bar">
      <ButtonsBar
        isShowFoldBtn
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
      @notify="handleDynamicTableNotify"
    />
    <!-- <Suspense>
      <template #default>
        <DynamicTable
          class="table-container"
          border
          :columns="tableColumns"
          v-model="tableData"
          @notify="handleDynamicTableNotify"
        />
      </template>
      <template #fallback>
        <div>加载中</div>
      </template>
    </Suspense> -->
  </div>
</template>

<script setup>
import { ref } from "vue";
import { ElCard } from "element-plus";
defineProps({
  msg: String,
});
const page = ref({});
const formData = ref({
  name1: "张三",
  name2: "A111",
  name4:
    "迪桑娜跨境电商迪桑娜跨境电商迪桑娜跨境电商迪桑娜跨境电商迪桑娜跨境电商迪桑娜跨境电商迪桑娜跨境电商迪桑娜跨境电商迪桑娜跨境电商迪桑娜跨境电商迪桑娜跨境电商",
});
const formItems = ref([
  {
    formDataKey: "name1",
    labelName: "设备名称1:",
    labelWidth: "90px",
    span: 6,
    childWidget: {
      widget: "input",
      widgetAttrs: {
        placeholder: "请输入",
        clearable: true,
        disabled: true,
      },
    },
  },
  //   {
  //     type: "select",
  //     formDataKey: "name2",
  //     labelName: "设备名称2:",
  //     labelWidth: "90px",
  //     span: 6,
  //     childWidget: {
  //       clearable: true,
  //       placeholder: "请选择AAA",
  //       options: [
  //         {
  //           value: "A111",
  //           label: "A111",
  //         },
  //         {
  //           value: "A222",
  //           label: "A222",
  //         },
  //         {
  //           value: "A333",
  //           label: "A333",
  //         },
  //       ],
  //     },
  //   },
  //   {
  //     type: "date",
  //     formDataKey: "name3",
  //     labelName: "设备名称3:",
  //     labelWidth: "90px",
  //     span: 6,
  //     childWidget: {
  //       type: "date",
  //       placeholder: "请选择日期",
  //       format: "YYYY/MM/DD",
  //     },
  //   },
  //   {
  //     type: "text",
  //     formDataKey: "name4",
  //     labelName: "设备名称4:",
  //     labelWidth: "90px",
  //     span: 6,
  //     childWidget: {
  //       isShowHoverTip: true,
  //       overflowHiddenText: true,
  //     },
  //   },
  //   {
  //     type: "datetime",
  //     formDataKey: "name5",
  //     labelName: "设备名称5:",
  //     labelWidth: "90px",
  //     span: 6,
  //     childWidget: {
  //       type: "datetimerange",
  //       "start-placeholder": "Start Date",
  //       "end-placeholder": "End Date",
  //     },
  //   },
  //   {
  //     type: "cascader",
  //     formDataKey: "name6",
  //     labelName: "设备名称6:",
  //     labelWidth: "90px",
  //     span: 6,
  //     childWidget: {
  //       clearable: true,
  //       placeholder: "请选择cascader",
  //       options: [
  //         {
  //           value: "A111",
  //           label: "A111",
  //           children: [
  //             {
  //               value: "A222",
  //               label: "A222",
  //               children: [
  //                 {
  //                   value: "A444",
  //                   label: "A444",
  //                 },
  //                 {
  //                   value: "A555",
  //                   label: "A555",
  //                 },
  //               ],
  //             },
  //             {
  //               value: "A333",
  //               label: "A333",
  //             },
  //           ],
  //         },
  //         {
  //           value: "B111",
  //           label: "B111",
  //           children: [
  //             {
  //               value: "B222",
  //               label: "B222",
  //               children: [
  //                 {
  //                   value: "B444",
  //                   label: "B444",
  //                 },
  //                 {
  //                   value: "B555",
  //                   label: "B555",
  //                 },
  //               ],
  //             },
  //             {
  //               value: "B333",
  //               label: "B333",
  //             },
  //           ],
  //         },
  //       ],
  //     },
  //   },
  //   {
  //     type: "checkbox",
  //     formDataKey: "name7",
  //     labelName: "设备名称7:",
  //     labelWidth: "90px",
  //     span: 6,
  //     childWidget: {
  //       options: [
  //         {
  //           value: "A111",
  //           label: "A111",
  //         },
  //         {
  //           value: "A222",
  //           label: "A222",
  //         },
  //         {
  //           value: "A333",
  //           label: "A333",
  //         },
  //       ],
  //     },
  //   },
  //   {
  //     type: "radio",
  //     formDataKey: "name8",
  //     labelName: "设备名称8:",
  //     labelWidth: "90px",
  //     span: 6,
  //     childWidget: {
  //       options: [
  //         {
  //           value: "A111",
  //           label: "A111",
  //         },
  //         {
  //           value: "A222",
  //           label: "A222",
  //         },
  //         {
  //           value: "A333",
  //           label: "A333",
  //         },
  //       ],
  //     },
  //   },
  //   {
  //     type: "color",
  //     formDataKey: "name9",
  //     labelName: "设备名称9:",
  //     labelWidth: "90px",
  //     span: 6,
  //     childWidget: {
  //       width: "100%",
  //     },
  //   },
  //   {
  //     type: "switch",
  //     formDataKey: "name10",
  //     labelName: "设备名称10:",
  //     labelWidth: "90px",
  //     span: 6,
  //     childWidget: {
  //       width: "300px",
  //       "inline-prompt": true,
  //       style: "--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949",
  //       "active-text": "完整展示多个内容",
  //       "inactive-text": "多个内容",
  //     },
  //   },
  //   {
  //     type: "slider",
  //     formDataKey: "name11",
  //     labelName: "设备名称11:",
  //     labelWidth: "90px",
  //     span: 6,
  //   },
  //   {
  //     type: "button",
  //     span: 6,
  //     childWidget: {
  //       buttons: [
  //         {
  //           name: "搜索",
  //           shortcutKey: "F1",
  //           eventKey: "openAddDialog",
  //           childWidget: {
  //             type: "primary",
  //           },
  //         },
  //         {
  //           name: "重置",
  //           shortcutKey: "F1",
  //           eventKey: "openAddDialog",
  //           childWidget: {
  //             type: "primary",
  //           },
  //         },
  //       ],
  //     },
  //   },
  // {
  //   fieldType: 'text',
  //   formDataKey: 'name2',
  //   labelName: '设备名称2:',
  //   labelWidth: '90px',
  //   span: 6
  // },
  // {
  //   fieldType: 'text',
  //   formDataKey: 'name3',
  //   labelName: '设备名称2:',
  //   labelWidth: '90px',
  //   span: 6
  // },
  // {
  //   fieldType: 'text',
  //   formDataKey: 'name4',
  //   labelName: '设备名称2:',
  //   labelWidth: '90px',
  //   span: 6
  // }
]);
const tableButtons = ref([
  {
    name: "新增",
    shortcutKey: "F1",
    eventKey: "openAddDialog",
    childWidget: {
      type: "primary",
    },
  },
  {
    name: "模版导出",
    shortcutKey: "F1",
    eventKey: "openAddDialog",
  },
  {
    name: "导入",
    shortcutKey: "F1",
    eventKey: "openAddDialog",
  },
  {
    name: "停用",
    shortcutKey: "F1",
    eventKey: "openAddDialog",
  },
  {
    name: "新增",
    shortcutKey: "F1",
    eventKey: "openAddDialog",
  },
  {
    name: "删除",
    shortcutKey: "F1",
    eventKey: "openAddDialog",
  },
]);
const tableButtonEvent = {
  openAddDialog: (item) => {},
};
const tableColumns = ref([
  {
    prop: "id",
    label: "id",
    hidden: true,
  },
  {
    prop: "aaa1",
    label: "测试1",
    sortable: false,
  },
  {
    prop: "aaa2",
    label: "测试2",
  },
  {
    prop: "aaa3",
    label: "测试3",
  },
  {
    prop: "aaa4",
    label: "测试4",
  },
]);
const tableData = ref([
  {
    aaa1: "1111",
    aaa2: "2222",
    aaa3: "3333",
    aaa4: "4444",
  },
  {
    aaa1: "1111",
    aaa2: "2222",
    aaa3: "3333",
    aaa4: "4444",
  },
  {
    aaa1: "1111",
    aaa2: "2222",
    aaa3: "3333",
    aaa4: "4444",
  },
  {
    aaa1: "1111",
    aaa2: "2222",
    aaa3: "3333",
    aaa4: "4444",
  },
]);
function handleDynamicFormNotify(params) {
  if (params.clickedBtn) {
    tableButtonEvent[params.clickedBtn.eventKey](params.clickedBtn);
  }
}
function handleDynamicTableNotify(params) {
  // if (['size-change', 'current-change'].includes(params.eventType)) {
  // }
}
function handleButtonsClick(item) {
  tableButtonEvent[item.eventKey](item);
}
</script>

<style lang="scss" scoped>
.demo2 {
  height: 100%;
  display: flex;
  flex-direction: column;
  .table-container {
    // flex: 1;
    // height: 0;
    height: 100%;
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

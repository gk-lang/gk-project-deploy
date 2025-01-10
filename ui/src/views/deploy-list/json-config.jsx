import { ref } from "vue";
export const searchFormItems = ref([
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
]);
export const tableButtons = ref([
  {
    name: "新增",
    shortcutKey: "",
    eventKey: "openDialogAddOrEdit",
    childWidget: {
      type: "primary",
    },
  },
]);
export const tableColumns = ref([
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

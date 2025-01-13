import { ref } from "vue";
import { ElButton, ElMessage, ElTag } from "element-plus";

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
export const dialogAddOrEditFormItems = ref([
  {
    formDataKey: "appName",
    labelName: "应用名称",
    labelWidth: "120px",
    span: 24,
    childWidget: {
      widget: "text",
    },
  },
  {
    formDataKey: "appNameEn",
    labelName: "应用英文名",
    labelWidth: "120px",
    span: 24,
    childWidget: {
      widget: "text",
    },
  },
  {
    formDataKey: "appType",
    labelName: "应用类型",
    labelWidth: "120px",
    span: 24,
    childWidget: {
      widget: "text",
    },
  },
  {
    formDataKey: "appDesc",
    labelName: "应用描述",
    labelWidth: "120px",
    span: 24,
    childWidget: {
      widget: "text",
    },
  },
  {
    formDataKey: "appOs",
    labelName: "移动操作系统",
    labelWidth: "120px",
    span: 24,
    hidden: true,
    childWidget: {
      widget: "text",
    },
  },
  {
    formDataKey: "website",
    labelName: "官网地址",
    labelWidth: "120px",
    span: 24,
    childWidget: {
      widget: "text",
    },
  },
  {
    formDataKey: "secretKey",
    labelName: "client_id",
    labelWidth: "120px",
    span: 24,
    childWidget: {
      render: (h, scope) => {
        return (
          <div>
            <span style="margin-right:10px;">{scope.formData?.secretKey}</span>
            <ElButton
              onClick={() => copyText(scope.formData?.secretKey || "")}
              type="primary"
              plain
              size="small"
            >
              复制
            </ElButton>
          </div>
        );
      },
    },
  },
  // {
  //   formDataKey: "apiKey",
  //   labelName: "client_secret",
  //   labelWidth: "120px",
  //   span: 24,
  //   childWidget: {
  //     render: (h, scope) => {
  //       return (
  //         <div>
  //           <span style="margin-right:10px;">{scope.formData?.apiKey}</span>
  //           <ElButton onClick={()=>copyText(scope.formData?.apiKey||'')} type="primary" plain size="small">
  //             复制
  //           </ElButton>
  //         </div>
  //       );
  //     },
  //   },
  // },
  // {
  //   formDataKey: "approveStatus",
  //   labelName: "审批状态",
  //   labelWidth: "120px",
  //   span: 24,
  //   childWidget: {
  //     render: (h, scope) => {
  //       if (scope.formData?.approveStatus === 1) {
  //         return (
  //           <ElTag key="1" type="success" effect="plain">
  //             审批通过
  //           </ElTag>
  //         );
  //       } else {
  //         return (
  //           <ElTag key="2" type="danger" effect="plain">
  //             审批驳回
  //           </ElTag>
  //         );
  //       }
  //     },
  //   },
  // },
]);

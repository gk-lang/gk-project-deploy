<!-- 应用所关联的api列表 -->
<template>
  <dialog-base
    v-model:visible="visibleDialog"
    :title="dialogTitle"
    width="70%"
    custom-class="dialog-app-api-relate"
    @cancel="cancel()"
    @confirm="confirm()"
  >
    <div class="dialog-content">
      <DynamicForm
        :loading="saveLoading"
        ref="dynamicFormRef"
        :formItems="dialogAddOrEditFormItems"
        v-model="formData"
        @notify="handleDynamicFormNotify"
      />
    </div>
  </dialog-base>
</template>
<script name="deploy-list-dialog-add-or-edit" lang="jsx" setup>
import { cloneDeep } from "lodash-es";
import { ref, computed, watch, onMounted, nextTick } from "vue";
import { dialogAddOrEditFormItems } from "./json-config.jsx";

const emits = defineEmits(["update:isShow"]);
const props = defineProps({
  isShow: {
    type: Boolean,
    default: "",
  },
  editFormData: {
    type: Object,
    default: () => {
      return {};
    },
  },
});
const formItems = ref([]);
const formData = ref({})
const searchFormData1 = ref({
  apiDocTypeId: "",
  apiName: "",
});

const dialogTitle = ref("构建配置");
const saveLoading = ref(false);

const visibleDialog = computed({
  get() {
    return props.isShow;
  },
  set(val) {
    emits("update:isShow", val);
  },
});
function resetData() {
  searchFormData1.value = {
    apiDocTypeId: "",
    apiName: "",
  };
}
function generateSaveParams() {
  const list = tableData2.value.filter((x) => x.approveStatus === 0);
  const openAuthorityAppList = list.map((x) => {
    return {
      authorityId: x.authorityId,
      apiCode: x.apiCode,
      apiId: x.apiId,
    };
  });
  const openAppId = props.editFormData?.id;
  return {
    openAppId,
    openAuthorityAppList,
  };
}
function handleDynamicFormNotify(){

}
async function handleSave() {
  const params = generateSaveParams();
  let resp = null;
  saveLoading.value = true;
  try {
   // resp = await saveAppBindApi(params);
  } catch (error) {
    saveLoading.value = false;
    console.error(error);
  }
  saveLoading.value = false;
  if (resp && resp.code == 200) {
    visibleDialog.value = false;
    window.$msg.success(resp.message || "保存成功!");
    emits("save", true);
  } else {
    window.$msg.error(resp.message || "保存失败!");
  }
}
function cancel() {
  visibleDialog.value = false;
  emits("close");
}
function confirm() {
  handleSave();
}
watch(
  () => props.isShow,
  async (val) => {
    if (val) {
      resetData();
    }
  }
);
onMounted(() => {
  
});
</script>
<style lang="scss">
.el-overlay {
  .el-overlay-dialog {
    div[custom-class*="dialog-app-api-relate"] {
      .el-dialog__body {
        padding: 10px 10px 0px 10px;
        .dialog-content {
          display: flex;
          justify-content: space-between;
          .left-content {
            width: calc(60% - 110px);
            .search-bar.el-card {
              --el-card-padding: 10px;
            }
            .table-container {
              height: auto;
              margin-top: 10px;
              .el-form {
                margin-top: 0px;
              }
            }
          }
          .el-table {
            .approveStatus {
              .cell {
                .new-data {
                  position: relative;
                  width: max-content;
                  &::after {
                    content: "";
                    display: block;
                    position: absolute;
                    width: 10px;
                    height: 10px;
                    background-color: green;
                    border-radius: 50%;
                    top: 0px;
                    right: 0px;
                  }
                }
              }
            }
          }
          .middle-content {
            width: 80px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .right-content {
            width: 40%;
            .search-bar.el-card {
              --el-card-padding: 10px;
            }
            .table-container {
              margin-top: 10px;
              .el-form {
                margin-top: 0px;
              }
            }
          }
        }
      }
      .el-dialog__footer {
        .dialog-footer {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          .tip-msg {
            display: flex;
            align-items: center;
            color: var(--el-color-primary);
            /* color: var(--el-color-warning); */
            background: #ddefff;
            border-radius: 4px 4px 4px 4px;
            border: 1px solid #0083ff;
            padding: 5px 20px 5px 7px;
            .el-icon {
              margin-right: 5px;
            }
            .red {
              color: red;
              font-weight: 600;
              font-size: 16px;
              padding: 0px 5px;
            }
          }
        }
      }
    }
  }
}
// @media screen and (max-height: 700px) {
//   .el-overlay {
//     .el-overlay-dialog {
//       div[custom-class*="dialog-app-api-relate"] {
//         .el-dialog__body {
//           background-color: #0083ff;
//           .table-container {
//             height: 400px !important;
//           }
//         }
//       }
//     }
//   }
// }
</style>

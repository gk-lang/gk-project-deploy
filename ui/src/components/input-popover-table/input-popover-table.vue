<template>
  <div class="input-popover-table">
    <el-input v-model="inputValue" v-bind="inputAttrs" @clear="handleClear">
      <template #suffix>
        <el-button
          link
          ref="buttonRef"
          icon="IEpDocument"
          class="suffix-button-distance"
          :disabled="inputAttrs.disabled"
          @click="togglePopover"
          v-click-outside="onClickOutside"
        />
      </template>
    </el-input>
    <el-popover
      ref="popoverRef"
      :visible="popoverVisible"
      virtual-triggering
      :virtual-ref="buttonRef"
      trigger="click"
      hide-after="0"
      popper-class="input-popover-table-popper"
      :width="600"
    >
      <div class="header">
        <div>{{ title }}</div>
        <div>
          <el-button link @click.stop="closePopover()">
            <!-- <jzt-global-icon>
              <jzt-global-svg
                icon-class="icon-yeqian-guanbi"
                size="12"
              ></jzt-global-svg>
            </jzt-global-icon> -->
          </el-button>
        </div>
      </div>
      <div class="content">
        <el-input
          ref="searchRef"
          v-model="searchValue"
          v-bind="searchAttrs"
          class="popover-search"
          @keyup.enter.stop="searchTableData"
        >
          <template #suffix>
            <el-button link icon="IEpSearch" @click="searchTableData" />
          </template>
        </el-input>
        <DynamicTable
          class="popover-table"
          border
          :height="tableHeight"
          :loading="tableLoading"
          :columns="tableColumns"
          v-model="tableData"
          v-model:page="tablePage"
          v-bind="searchAttrs"
          @notify="handleDynamicTableNotify"
        />
      </div>
    </el-popover>
  </div>
</template>

<script setup>
import { ref, unref, watch, computed, nextTick } from 'vue'
import { ElInput,ElButton,ElPopover,ClickOutside as vClickOutside } from 'element-plus'
// import DynamicTable from '@/components/dynamic-widget/dynamic-table.vue'
// import { hasClassOrParentHasClass } from '#/utils'
// import { service, gateway } from '#/http'
const searchRef = ref()
const buttonRef = ref()
const popoverRef = ref()
const popoverVisible = ref(false)
const tableLoading = ref(false)
const tableData = ref([])
const tablePage = ref({})

const emits = defineEmits(['search', 'change'])
const props = defineProps({
  modelValue: {
    type: Object,
    default: () => {
      return {
        selectRow: null,
        inputValue: '',
        searchValue: ''
      }
    }
  },
  /* Popover标题 */
  title: {
    type: String,
    default: () => {
      return ''
    }
  },
  /* 搜索触发的事件映射Url */
  remoteSearchUrl: {
    type: String,
    default: () => {
      return ''
    }
  },
  /* 搜索触发的事件映射key */
  remoteSearchParams: {
    type: Object,
    default: () => {
      return {}
    }
  },
  /* 搜索触发的事件映射key */
  remoteSearchMethodKey: {
    type: String,
    default: () => {
      return ''
    }
  },
  /* 表格列 */
  tableColumns: {
    type: Array,
    default: () => {
      return []
    }
  },
  /* 搜索触发的事件映射key */
  tableHeight: {
    type: String || Number,
    default: () => {
      return 200
    }
  },
  /* 选中表格行以后所映射选中行对应的属性key */
  displayMapKey: {
    type: String,
    default: () => {
      return 'name'
    }
  },
  /* 输入框配置 */
  inputAttrs: {
    type: Object,
    default: () => {
      return {}
    }
  },
  /* 搜索框配置 */
  searchAttrs: {
    type: Object,
    default: () => {
      return {}
    }
  },
  /* 表格配置 */
  tableAttrs: {
    type: Object,
    default: () => {
      return {}
    }
  }
})
const selectRow = computed({
  get() {
    return props.modelValue.selectRow
  },
  set(value) {
    emits('update:modelValue', {
      ...props.modelValue,
      inputValue: inputValue.value,
      searchValue: searchValue.value,
      selectRow: value
    })
  }
})
const inputValue = computed({
  get() {
    return props.modelValue.inputValue
  },
  set(value) {
    emits('update:modelValue', {
      ...props.modelValue,
      inputValue: value,
      searchValue: searchValue.value,
      selectRow: selectRow.value
    })
  }
})
const searchValue = computed({
  get() {
    return props.modelValue.searchValue
  },
  set(value) {
    emits('update:modelValue', {
      ...props.modelValue,
      inputValue: inputValue.value,
      searchValue: value,
      selectRow: selectRow.value
    })
  }
})

function handleClear() {
  const selectRowObj = {}
  Object.keys(selectRow.value).forEach(key => {
    selectRowObj[key] = ''
  })
  emits('update:modelValue', {
    ...props.modelValue,
    inputValue: '',
    searchValue: '',
    selectRow: selectRowObj
  })
  emits('change', {
    value: {
      ...props.modelValue,
      inputValue: '',
      searchValue: '',
      selectRow: null
    }
  })
}
async function searchTableData() {
  tableLoading.value = true
  if (props.remoteSearchMethodKey) {
    emits('search', {
      tablePage,
      searchValue,
      inputValue,
      selectRow,
      remoteSearchMethodKey: props.remoteSearchMethodKey,
      resolve: (data, totalNum) => {
        tableLoading.value = false
        tableData.value = data
        tablePage.value.total_num = totalNum
      }
    })
  } else if (props.remoteSearchUrl) {
    console.log('props.remoteSearchParams:', props.remoteSearchParams)
    try {
      const resp = await service({
        url: `${props.remoteSearchUrl}`,
        method: 'post',
        data: {
          ...props.remoteSearchParams,
          ...tablePage.value,
          keyWords: trimSpecial(searchValue.value || '')
        }
      })
      tableLoading.value = false
      tableData.value = resp?.data || []
      tablePage.value.total_num = resp?.total_num || 0
    } catch (error) {
      tableLoading.value = false
    }
  }

  setTimeout(() => {
    if (tableLoading.value) {
      tableLoading.value = false
      tableData.value = []
      tablePage.value.total_num = 0
    }
  }, 3000)
}

// 去除特殊字符~!@#$^-&*()=|{}':;',\[].<>/?~！@#￥……&*（）——|{}【】'；：""'。，、？
function trimSpecial(string) {
  // 替换字符串中的所有特殊字符（包含空格）
  if (string !== '') {
    const pattern =
      // eslint-disable-next-line no-useless-escape
      /[`~!@#$^\-&*()=|{}':;',\\\[\]\.<>\/?~！@#￥……&*（）——|{}【】'；：""'。，、？\s]/g
    string = string.replace(pattern, '')
  }
  return string
}
function onClickOutside(e) {
  // const isHas = hasClassOrParentHasClass(e.target, document, [
  //   'input-popover-table-popper'
  // ])
  // if (!isHas) {
  //   closePopover()
  // }
}
function closePopover() {
  popoverVisible.value = false
  unref(popoverRef).popperRef?.delayHide?.()
}
function togglePopover() {
  if (props.inputAttrs.disabled) return
  popoverVisible.value = !popoverVisible.value
  if (popoverVisible.value) {
    // searchValue.value = inputValue.value
    searchTableData()
    setTimeout(() => {
      searchRef.value.focus()
    })
  }
}
function handleDynamicTableNotify(params) {
  if (['size-change', 'current-change'].includes(params.eventType)) {
    searchTableData()
  }
  if (['row-click'].includes(params.eventType)) {
    const titleKey = props.displayMapKey
    emits('update:modelValue', {
      ...props.modelValue,
      inputValue: params.value[titleKey],
      searchValue: '',
      selectRow: params.value
    })
    emits('change', {
      value: {
        ...props.modelValue,
        inputValue: params.value[titleKey],
        searchValue: '',
        selectRow: params.value
      }
    })
    closePopover()
  }
}
</script>
<style lang="scss">
.el-popover.input-popover-table-popper {
  padding: 0px;
  border: none;
  box-shadow: 0 0 10px 0 rgba(44, 76, 130, 0.4);

  .header {
    background-color: #f5f5f5;
    font-size: 14px;
    line-height: 20px;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    // height: var(--jzt-global-modal-header-height);
    //  line-height: var(--jzt-global-modal-header-height);
    padding: 0 8px;
  }
  .content {
    padding: 8px;
    .popover-search {
      margin-bottom: 8px;
    }
  }
}
</style>
<style lang="scss" scoped>
.input-popover-table {
  width: 100%;
  :deep(.el-input) {
    // 处理前缀图标不垂直居中的问题
    .el-input__suffix {
      height: auto;
      font-size: 20px;
      .el-input__suffix-inner {
        flex-direction: row-reverse;
        -webkit-flex-direction: row-reverse;
        display: flex;
      }
    }
    .el-input__clear {
      position: relative;
      &:hover {
        color: rgb(109, 109, 240);
      }
      &::after {
        content: '';
        width: 1px;
        height: 50%;
        right: -5px;
        position: absolute;
        top: 25%;
        background-color: rgb(233, 233, 233);
      }
    }
  }
}
.input-popover-table-popper {
  .content {
    :deep(.el-input.popover-search) {
      // 处理前缀图标不垂直居中的问题
      .el-input__suffix {
        height: auto;
        font-size: 20px;
        .el-input__suffix-inner {
          flex-direction: row-reverse;
          -webkit-flex-direction: row-reverse;
          display: flex;
        }
      }
      .el-input__clear {
        position: relative;
        &:hover {
          color: rgb(109, 109, 240);
        }
        &::after {
          content: '';
          width: 1px;
          height: 50%;
          right: -5px;
          position: absolute;
          top: 25%;
          background-color: rgb(233, 233, 233);
        }
      }
    }
  }
}
</style>

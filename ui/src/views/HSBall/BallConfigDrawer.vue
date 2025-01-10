<template>
  <el-drawer
    class="ball-config-drawer"
    v-model="isShowDrawer"
    @close="handleDrawerClose"
    direction="rtl"
  >
    <template #header>
      <h4>小球运动参数配置</h4>
    </template>
    <template #default>
      <div>
        <el-form
          class="ball-config-form"
          :model="configData"
          label-width="auto"
          label-position="top"
        >
          <el-form-item label="小球运动范围">
            <span>高度：</span>
            <el-input-number
              v-model="configData.ballMoveRangeHeight"
              :min="10"
              :max="2000"
              controls-position="right"
            />
            <span style="margin-left: 30px">宽度：</span>
            <el-input-number
              v-model="configData.ballMoveRangeWidth"
              :min="10"
              :max="2000"
              controls-position="right"
            />
          </el-form-item>
          <el-form-item label="初始轨迹椭圆">
            <span>长轴：</span>
            <el-input-number
              v-model="configData.ellipseMajorAxis"
              :min="10"
              :max="2000"
              controls-position="right"
            />
            <span style="margin-left: 30px">短轴：</span>
            <el-input-number
              v-model="configData.ellipseMinorAxis"
              :min="10"
              :max="2000"
              controls-position="right"
            />
          </el-form-item>
          <!-- <el-form-item label="初始椭圆短轴">
            <el-slider
              max="1000"
              v-model="configData.ellipseMinorAxis"
              show-input
            />
          </el-form-item> -->
          <el-form-item label="小球半径">
            <el-slider v-model="configData.ballRadius" show-input />
          </el-form-item>
          <el-form-item label="小球随机运动时长(ms)">
            <el-slider max="60000" v-model="configData.ballMoveDuration" show-input />
          </el-form-item>
          <el-form-item label="小球总数">
            <el-slider max="30" v-model="configData.ballNum" show-input />
          </el-form-item>
          <el-form-item label="目标小球个数">
            <el-slider max="10" v-model="configData.targetBallNum" show-input />
          </el-form-item>
          <el-form-item label="小球运动速度">
            <el-slider v-model="configData.ballMoveSpeed" show-input />
          </el-form-item>
          <el-form-item label="小球碰撞半径">
            <el-slider max="200" v-model="configData.ballColliRadius" show-input />
          </el-form-item>
          <el-form-item label="追踪小球闪烁时长(ms)">
            <el-slider max="5000" v-model="configData.targetBallBlinkDuration" show-input />
          </el-form-item>
          <el-form-item label="追踪小球闪烁次数">
            <el-slider max="10" v-model="configData.targetBallBlinkCount" show-input />
          </el-form-item>
          <el-form-item label="小球闪烁停止到运动时的静止时间(ms)">
            <el-slider max="5000" v-model="configData.blinkToMoveSilentTime" show-input />
          </el-form-item>
          <el-form-item label="追踪小球闪烁时边框颜色">
            <el-color-picker
              v-model="configData.targetBallBlinkBorderColor"
              show-alpha
              :predefine="predefineColors"
            />
          </el-form-item>

          <el-form-item label="小球默认背景色">
            <el-color-picker
              v-model="configData.ballDefaultBgColor"
              show-alpha
              :predefine="predefineColors"
            />
          </el-form-item>
          <el-form-item label="视窗背景颜色">
            <el-color-picker
              v-model="configData.viewBGColor"
              show-alpha
              :predefine="predefineColors"
            />
          </el-form-item>
        </el-form>
      </div>
    </template>
    <template #footer>
      <div>
        <el-button @click="handleDrawerClose">取消</el-button>
        <el-button type="primary" @click="confirmConfig">确定</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script setup>
import { watch } from 'vue'
import { ref } from 'vue'
import {
  ElDrawer,
  ElForm,
  ElFormItem,
  ElInputNumber,
  ElSlider,
  ElColorPicker,
  ElButton
} from 'element-plus'

const isShowDrawer = ref(false)
const emits = defineEmits(['update:isShow', 'update:formData', 'save']) // 语法糖
const props = defineProps({
  isShow: {
    type: Boolean,
    default: false
  },
  formData: {
    type: Object,
    default: () => {}
  }
})

const configData = ref({
  ballMoveRangeHeight: 700, //小球运动范围-高度
  ballMoveRangeWidth: 1200, //小球运动范围-宽度
  ellipseMajorAxis: 400, //初始椭圆长轴
  ellipseMinorAxis: 300, //初始椭圆短轴
  ballMoveDuration: 8000, // 小球运动时间(多少ms后停止运动)
  ballRadius: 30, //小球半径
  ballNum: 8, //小球总数
  targetBallNum: 2, //目标小球个数
  ballMoveSpeed: 10, //小球运动速度
  ballColliRadius: 60, //小球碰撞半径
  ballDefaultBgColor: '#FFF', //小球默认背景色
  targetBallBlinkDuration: 2000, //追踪小球闪烁时长(ms)
  targetBallBlinkCount: 2, //追踪小球闪烁次数
  targetBallBlinkBorderColor: 'rgba(30, 144, 255, 1)', //追踪小球闪烁时边框颜色
  blinkToMoveSilentTime: 300, //小球闪烁停止到运动时的静止时间(ms)
  viewBGColor: '#CCC' //视窗背景颜色
})

const predefineColors = ref([
  '#ff4500',
  '#ff8c00',
  '#ffd700',
  '#90ee90',
  '#00ced1',
  '#1e90ff',
  '#c71585',
  'rgba(255, 69, 0, 0.68)',
  'rgb(255, 120, 0)',
  'hsv(51, 100, 98)',
  'hsva(120, 40, 94, 0.5)',
  'hsl(181, 100%, 37%)',
  'hsla(209, 100%, 56%, 0.73)',
  '#c7158577'
])
// Drawer窗口关闭操作
function handleDrawerClose() {
  isShowDrawer.value = false
  emits('update:isShow', isShowDrawer.value)
}

// Drawer窗口确定操作
function confirmConfig() {
  isShowDrawer.value = false
  emits('update:isShow', isShowDrawer.value)
  emits('update:formData', configData.value)
  emits('save', configData.value)
}
watch(
  () => props.isShow,
  (nv) => {
    isShowDrawer.value = nv
  }
)
watch(
  () => props.formData,
  (nv) => {
    configData.value = { ...nv }
  },
  {
    deep: true,
    immediate: true
  }
)
</script>
<style lang="scss">
.ball-config-drawer {
  .el-drawer__header {
    padding: 0px 5px 0px 15px;
    margin-bottom: 0px;
    h4 {
      text-align: left;
    }
    .el-drawer__close-btn {
      cursor: pointer;
    }
  }
  .ball-config-form {
    max-width: 600px;
    .el-color-picker {
      width: 100%;
      .el-color-picker__trigger {
        width: 100%;
      }
    }
  }
}
</style>

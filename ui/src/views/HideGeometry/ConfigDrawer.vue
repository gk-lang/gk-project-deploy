<template>
  <el-drawer
    class="ball-config-drawer"
    v-model="isShowDrawer"
    @close="handleDrawerClose"
    direction="rtl"
  >
    <template #header>
      <h4>隐藏几何图形参数配置</h4>
    </template>
    <template #default>
      <div>
        <el-form
          class="ball-config-form"
          :model="configData"
          label-width="auto"
          label-position="top"
        >
          <el-form-item :class="[{ random: configData.targetPositionType === 'Random' }]">
            <template #label>
              <span>目标位置</span>
              <el-radio-group v-model="configData.targetPositionType">
                <el-radio label="自定义生成" value="Custom" />
                <el-radio label="随机生成" value="Random" />
              </el-radio-group>
            </template>
            <el-radio-group v-model="configData.targetPosition">
              <el-radio label="第一象限" value="first" />
              <el-radio label="第二象限" value="second" />
              <el-radio label="第三象限" value="third" />
              <el-radio label="第四象限" value="fourth" />
              <el-radio label="坐标中心" value="center" />
              <!-- <el-radio label="随机象限" value="randomQuadrant" /> -->
              <!-- <el-radio label="坐标中心" value="center" />
              <el-radio label="任意位置" value="randomPosition" /> -->
            </el-radio-group>
          </el-form-item>
          <el-form-item
            :class="[{ random: configData.targetModelType === 'Random' }]"
          >
            <template #label>
              <span>目标类型</span>
              <el-radio-group v-model="configData.targetModelType">
                <el-radio label="自定义生成" value="Custom" />
                <el-radio label="随机生成" value="Random" />
              </el-radio-group>
            </template>
            <el-radio-group v-model="configData.targetModel">
              <el-radio label="圆形" value="Circle" />
              <el-radio label="三角形" value="Triangle" />
              <el-radio label="正方形" value="Square" />
            </el-radio-group>
          </el-form-item>
          <el-form-item
            :class="[{ random: configData.targetRadiusType === 'Random' }]"
            v-if="configData.targetModel === 'Circle'"
          >
            <template #label>
              <span>目标大小(半径长度)</span>
              <el-radio-group v-model="configData.targetRadiusType">
                <el-radio label="自定义生成" value="Custom" />
                <el-radio label="随机生成" value="Random" />
              </el-radio-group>
            </template>
            <el-slider max="180" v-model="configData.targetRadius" show-input />
          </el-form-item>
          <el-form-item
            v-else
            :class="[{ random: configData.targetSizeType === 'Random' }]"
          >
            <template #label>
              <span>目标边线颗粒数(目标大小)</span>
              <el-radio-group v-model="configData.targetSizeType">
                <el-radio label="自定义生成" value="Custom" />
                <el-radio label="随机生成" value="Random" />
              </el-radio-group>
            </template>
            <el-slider max="8" v-model="configData.targetSize" show-input />
          </el-form-item>
          <el-form-item
            :class="[{ random: configData.shapeSpacingType === 'Random' }]"
          >
            <template #label>
              <span>目标颗粒间距</span>
              <el-radio-group v-model="configData.shapeSpacingType">
                <el-radio label="自定义生成" value="Custom" />
                <el-radio label="随机生成" value="Random" />
              </el-radio-group>
            </template>
            <el-slider max="80" v-model="configData.shapeSpacing" show-input />
          </el-form-item>
          <el-form-item
            v-if="configData.targetModel !== 'Circle'"
            :class="[{ random: configData.targetOffsetAngleType === 'Random' }]"
          >
            <template #label>
              <span>目标偏移角度</span>
              <el-radio-group v-model="configData.targetOffsetAngleType">
                <el-radio label="自定义生成" value="Custom" />
                <el-radio label="随机生成" value="Random" />
              </el-radio-group>
            </template>
            <el-slider
              max="180"
              v-model="configData.targetOffsetAngle"
              show-input
            />
          </el-form-item>
          <el-form-item
            :class="[
              { random: configData.disruptorBoxDensityType === 'Random' },
            ]"
          >
            <template #label>
              <span>干扰物密度</span>
              <el-radio-group v-model="configData.disruptorBoxDensityType">
                <el-radio label="自定义生成" value="Custom" />
                <el-radio label="随机生成" value="Random" />
              </el-radio-group>
            </template>
            <el-slider
              max="100"
              v-model="configData.disruptorBoxDensity"
              show-input
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
import { ref, watch } from "vue";
import {
  ElDrawer,
  ElForm,
  ElFormItem,
  ElInputNumber,
  ElSlider,
  ElColorPicker,
  ElButton,
  ElRadio,
  ElRadioGroup,
  ElRadioButton,
} from "element-plus";

const isShowDrawer = ref(false);
const emits = defineEmits(["update:isShow", "update:formData", "save"]); // 语法糖
const props = defineProps({
  isShow: {
    type: Boolean,
    default: false,
  },
  formData: {
    type: Object,
    default: () => {},
  },
});

const configData = ref({
  targetPosition: "center", //目标位置  1、2、3、4象限
  targetPositionType: "Custom",
  targetModel: "Square", //目标类型 园/三角形/正方形
  targetModelType: "Custom",
  targetRadius: 100, //目标半径 S1.1倍/L1.2倍
  targetRadiusType: "Custom",
  targetSize: 4, //目标边线颗粒数(目标大小) S1.1倍/L1.2倍
  targetSizeType: "Custom",
  shapeSpacing: 30, //目标颗粒间距
  shapeSpacingType: "Custom",
  targetOffsetAngle: 0, //目标偏移角度 0/5/10/12.5/15/16/17/18/19/20
  targetOffsetAngleType: "Custom",
  disruptorBoxDensity: 50, //干扰物密度 也可表示干扰物数目  400/500/600
  disruptorBoxDensityType: "Custom",
});

// Drawer窗口关闭操作
function handleDrawerClose() {
  isShowDrawer.value = false;
  emits("update:isShow", isShowDrawer.value);
}

// Drawer窗口确定操作
function confirmConfig() {
  isShowDrawer.value = false;
  emits("update:isShow", isShowDrawer.value);
  emits("update:formData", configData.value);
  emits("save", configData.value);
}
watch(
  () => props.isShow,
  (nv) => {
    isShowDrawer.value = nv;
  }
);
watch(
  () => props.formData,
  (nv) => {
    configData.value = { ...nv };
  },
  {
    deep: true,
    immediate: true,
  }
);
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
    .el-form-item {
      &__label {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      &.random {
        .el-form-item__content {
          display: none;
        }
      }
    }

    .el-color-picker {
      width: 100%;
      .el-color-picker__trigger {
        width: 100%;
      }
    }
  }
}
</style>

<template>
  <div class="demo2 auto-container">
    <RichTinymce v-model="richEditorValue" />
  </div>
</template>

<script setup>
import { ref } from "vue";
import { ElCard } from "element-plus";
import RichTinymce from "@/components/rich-tinymce/rich-tinymce.vue";
const richEditorValue = ref("你好！");
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

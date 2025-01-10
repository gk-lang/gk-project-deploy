<template>
  <div class="main-content">
    <section>
      <router-view v-slot="{ Component }">
        <transition mode="out-in" name="fade-transform">
          <keep-alive :include="cachedRoutes" :max="keepAliveMaxNum">
            <component :is="Component" />
          </keep-alive>
          <!-- <keep-alive :include="cachedRoutes" :max="keepAliveMaxNum">
          <router-view />
        </keep-alive> -->
        </transition>
      </router-view>
    </section>
  </div>
</template>
<script setup>
import { ref } from "vue";
import config from "@/config/index.js";
const cachedRoutes = ref([]);
const keepAliveMaxNum = ref(config.keepAliveMaxNum);
</script>
<style lang="scss" scoped></style>

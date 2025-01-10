import { defineStore } from "pinia";
import { store } from "../index";
// import { setCssVar, humpToUnderline } from '@/utils'
// import { colorIsDark, hexToRGB, lighten, mix } from '@/utils/color'
// import { ElMessage, ComponentSize } from 'element-plus'
// import { unref } from 'vue'
import defaultTheme from "@/config/theme.config.js";
import { isJson } from "@/utils/validate";
const getLocalStorage = (key) => {
  const value = localStorage.getItem(key);
  if (isJson(value)) {
    return JSON.parse(value);
  } else {
    return false;
  }
};

export const useAppStore = defineStore("app", {
  state: () => {
    return {
      title: import.meta.env.VITE_APP_TITLE, // 标题
      pageLoading:false,
      theme: getLocalStorage("theme") || { ...defaultTheme },
    };
  },
  getters: {
    getTitle(){
      debugger
      return this.title;
    },
    getPageLoading() {
      return this.pageLoading;
    },
    getTheme() {
      return this.theme;
    },
  },
  actions: {
    setPageLoading(pageLoading) {
      this.pageLoading = pageLoading
    },
    setTheme(theme) {
      this.theme = Object.assign(this.theme, theme);
    },
    resetTheme() {
      this.theme = { ...defaultTheme }
      localStorage.removeItem('theme')
      document.getElementsByTagName(
        'body'
      )[0].className = `app-theme-${this.theme.themeName}`
    },
  },
  persist: true,
});

export const useAppStoreWithOut = () => {
  return useAppStore(store);
};

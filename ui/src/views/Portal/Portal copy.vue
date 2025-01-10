<template>
  <div>
    <div class="layout-header">
      <div class="header-container">
        <div class="header-tab">
          <div class="tag logo">
            <img :src="logoPath" alt="" />
          </div>
          <div
            class="tag"
            v-for="item in menuList"
            :style="{ width: item.width }"
            @click="handleMainMenuItemClick(item)"
          >
            <el-dropdown :hide-on-click="false">
              <span class="el-dropdown-link">
                {{ item.title }}
              </span>
              <template #dropdown>
                <ElScrollbar>
                  <div class="ft-nav-develop-container">
                    <div class="develop-type">
                      <div class="name">地址服务</div>
                      <div class="develop-item-wrapper">
                        <div class="develop-item">地址级别判断1</div>
                        <div class="develop-item">地址级别判断2</div>
                        <div class="develop-item">地址级别判断3</div>
                        <div class="develop-item">地址级别判断4</div>
                      </div>
                    </div>
                    <div class="develop-type">
                      <div class="name">地址服务2</div>
                      <div class="develop-item-wrapper">
                        <div class="develop-item">地址级别判断1</div>
                        <div class="develop-item">地址级别判断2</div>
                        <div class="develop-item">地址级别判断3</div>
                        <div class="develop-item">地址级别判断4</div>
                      </div>
                    </div>
                  </div>
                </ElScrollbar>
              </template>
            </el-dropdown>
            <div v-show="item.isSelected" class="nav-underline"></div>
          </div>
        </div>
        <div class="header-func">
          <div class="tag control" @click="handleControlBtnLogin">
            <el-dropdown :hide-on-click="false">
              <span class="el-dropdown-link"> 控制台 </span>
            </el-dropdown>
          </div>
          <div>
            <span class="tag" @click="handleLoginBtnLogin">
              <el-dropdown :hide-on-click="false">
                <span class="el-dropdown-link"> 登录 </span>
              </el-dropdown>
            </span>
            <span> | </span>
            <span class="tag">
              <el-dropdown :hide-on-click="false">
                <span class="el-dropdown-link"> 注册 </span>
              </el-dropdown>
            </span>
          </div>
        </div>
      </div>
    </div>
    
    <div class="footer-container">
      <div class="footer-con-wrap">
        <div class="footer-content">
          <div class="qiao-logo">
            <div class="new-logo">
              <img :src="logoPath2" class="new-logo-img" alt="" />
              <!-- <span class="short-line"></span> -->
              <div>九州通物流开放平台</div>
            </div>
          </div>
          <div class="qiao-link" v-for="item in linkList">
            <div class="link-item">
              <p>{{ item.title }}</p>
              <ul>
                <li v-for="childItem in item.children">
                  <span>{{ childItem.title }}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div class="footer-copyright-wrap">
        <div class="footer-copyright">
          九州通物流版权所有 Copyright ©2024 sf-express.com Inc. All rights
          reserved. 粤ICP备08034243号
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import {
  ElForm,
  ElFormItem,
  ElRow,
  ElCol,
  ElInput,
  ElButton,
  ElDropdown,
  ElDropdownMenu,
  ElDropdownItem,
  ElScrollbar,
  ElCarousel,
  ElCarouselItem,
} from "element-plus";
import logoPath from "@/assets/portal/logo.png";
import logoPath2 from "@/assets/portal/logo-白字.png";

import bannerPath from "@/assets/portal/banner1.png";
import hydtPath from "@/assets/portal/货运地图.png";
import dsPath from "@/assets/portal/电商.png";
import kdwlPath from "@/assets/portal/快递物流.png";
import shfwPath from "@/assets/portal/售后服务.png";

const router = useRouter();

const menuList = ref([
  {
    title: "首页",
    width: "60px",
    value: "",
    isSelected: true,
  },
  {
    title: "开发文档",
    width: "70px",
    value: "",
  },
  {
    title: "解决方案",
    width: "70px",
    value: "",
  },
  {
    title: "服务与支持",
    width: "85px",
    value: "",
  },
]);
const supportList = ref([
  {
    name: "快递物流",
    title: "痛点：中转调度效率需提升、地址识别 准确率不高、人员区域管理",
    content: "客户细分：快递、物流、同城派送",
    imgPath: kdwlPath,
    isSelected: true,
  },
  {
    name: "货运地图",
    title:
      "痛点：货运路线运输成本高、禁行区域无提示、在途安全无保障、货运油耗成本高",
    content: "客户细分：快递、物流、货运企业",
    imgPath: hydtPath,
    isSelected: false,
  },
  {
    name: "售后客服",
    title:
      "痛点：协助客户下单流程中，常遇到客户地址不清晰无法识别业务区，分单效率",
    content: "客户细分：售后客服",
    imgPath: shfwPath,
    isSelected: false,
  },
]);
const selectedSupportItem = ref({});
function handleSupportMenuClick(item) {
  supportList.value.forEach((x) => (x.isSelected = false));
  item.isSelected = true;
  selectedSupportItem.value = item;
}
function handleMainMenuItemClick(item) {
  menuList.value.forEach((x) => (x.isSelected = false));
  item.isSelected = true;
}
function handleControlBtnLogin() {
  router.push("/admin");
}
function handleLoginBtnLogin() {
  router.push("/login");
}
const linkList = ref([
  {
    title: "新手入门",
    children: [
      {
        title: "接入指南",
        href: "",
      },
      {
        title: "平台规则",
        href: "",
      },
      {
        title: "平台公告",
        href: "",
      },
    ],
  },
  {
    title: "技术支持",
    children: [
      {
        title: "API文档",
        href: "",
      },
      {
        title: "业务文档",
        href: "",
      },
      {
        title: "开发规范",
        href: "",
      },
    ],
  },
  {
    title: "客服帮助",
    children: [
      {
        title: "FAQ",
        href: "",
      },
      {
        title: "在线报障",
        href: "",
      },
      {
        title: "联系我们",
        href: "",
      },
    ],
  },
  {
    title: "友情链接",
    children: [
      {
        title: "九州通",
        href: "",
      },
      {
        title: "企业服务平台",
        href: "",
      },
      {
        title: "九州通物流官网",
        href: "",
      },
    ],
  },
]);
onMounted(() => {
  selectedSupportItem.value = supportList.value.find((x) => x.isSelected);
});
</script>
<style lang="scss" scoped>
.layout-header {
  --header-base-font: -apple-system, BlinkMacSystemFont, "Helvetica Neue",
    Helvetica, Segoe UI, Arial, Roboto, "PingFang SC", "miui",
    "Hiragino Sans GB", "Microsoft Yahei", sans-serif;
  user-select: none;
  z-index: 999;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background: rgba(255, 255, 255, 0.2);
  box-shadow: 0 2px 6px #2222221a;
  backdrop-filter: blur(10px);
  color: #222;
  font-family: var(--header-base-font);
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;

  .header-container {
    margin: 0 auto;
    width: 1390px;
    display: flex;
    justify-content: space-between;
    height: 56px;
    line-height: 56px;
    .tag {
      position: relative;
      text-align: center;
      &.logo {
        width: 120px;
        height: 56px;
        display: flex;
        align-items: center;
        img {
          height: 25px;
        }
      }
      .nav-underline {
        width: 100%;
        position: absolute;
        bottom: 0;
        display: block;
        height: 3px;
        background-color: #ed0014;
        transition: all 0.2s ease-out;
      }
      &.control {
        background-image: url('@/assets/portal/控制台.png');
        background-repeat: no-repeat;
        background-size: 16px 16px;
        background-position: left center;
        padding-left: 5px;
        min-width: 80px;
      }
      :deep(.el-dropdown) {
        height: 56px;
        line-height: 56px;
        color: #222;
        &:hover {
          color: #2562ff;
          cursor: pointer;
        }
        .el-dropdown-link {
          font-size: 16px;
          cursor: pointer;
          outline: none !important;
        }
      }
    }
    .header-tab {
      width: 660px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: relative;
    }
    .header-func {
      margin-right: 100px;
      width: 185px;
      display: flex;
      justify-content: space-between;
    }
  }
}
.footer-container {
  width: 100%;
  .footer-con-wrap {
    width: 100%;
    height: 250px;
    background: #141222;
    -webkit-backdrop-filter: blur(10px);
    backdrop-filter: blur(10px);
    .footer-content {
      margin: 0 auto;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .qiao-logo {
      float: left;
      height: 35px;
      width: 250px;
      //   margin-top: 105px;
      line-height: 35px;
      //   &.logo {

      //     img {
      //       height: 25px;
      //     }
      //   }
      .new-logo {
        text-align: center;
        .new-logo-img {
          height: 25px;
        }
        span {
          color: #fff;
          font-size: 16px;
          text-align: left;
          font-weight: 700;
        }
        .short-line {
          align-self: center;
          width: 1px;
          opacity: 0.4;
          background: #bec0e7;
          height: 14px;
          margin: 0 8px;
        }
      }
    }
    .qiao-link {
      margin-left: 157px;
      margin-top: 50px;
      display: inline-block;
      .link-item {
        display: inline-block;
        width: 119px;
        text-align: left;
        margin-right: 50px;
        p {
          color: #fff;
          font-size: 16px;
          font-weight: 700;
          margin-bottom: 26px;
        }
        ul {
          padding-left: 0px;
        }
        li {
          list-style: none;
          color: #828395;
          font-size: 14px;
          line-height: 32px;
          cursor: pointer;
        }
      }
    }
  }
  .footer-copyright-wrap {
    width: 100%;
    height: 30px;
    background: #000;
    .footer-copyright {
      width: 1010px;
      margin: 0 auto;
      opacity: 0.7;
      color: #828395;
      font-size: 12px;
      line-height: 30px;
      letter-spacing: 1px;
      text-align: center;
    }
  }
}


@media screen and (max-width: 1360px) {
  .layout-header .header-container {
    width: 1000px;
    .header-func {
      margin-right: 0;
    }
  }
}

@media screen and (max-width: 1460px) {
  .footer-container .footer-con-wrap .qiao-link[data-v-323c027e] {
    margin-left: 60px;
  }
}
</style>

<template>
    <div class="service-container">
      <div class="service-tree">
        <ApiMenu />
      </div>
      <div class="service-content">
        <ApiContent />
      </div>
    </div>
  </template>
  <script setup>
  // import ApiMenu from "./ApiMenu.vue";
  // import ApiContent from "./ApiContent.vue";
  </script>
  <style lang="scss" scoped>
  .service-container {
    //   min-height: var(--layout-content-height);
    //   display: flex;
    //   justify-content: space-around;
    //   padding: 0 calc(50% - 650px);
    //   position: relative;
    //   margin-top: 1rem;
    //   margin-bottom: 75px;
  
    display: flex;
    justify-content: flex-start;
  
    padding: 90px 70px 50px 70px;
    width: 100%;
    height: var(--layout-content-height);
    box-sizing: border-box;
    .service-tree {
      width: 240px;
      max-width: 240px;
      background: #fff;
      margin-right: 20px;
      height: 100%;
    }
    .service-content {
      background-color: #fff;
      //   background: #fff;
      padding: 20px;
      flex-grow: 1;
    }
  }
  </style>
  
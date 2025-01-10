<template>
  <div class="game-container auto-height-container">
    <svg
      ref="svgRef"
      id="svgRef"
      style="width: 100%; height: 100%"
      v-if="isClear"
    >
      <defs>
        <line
          id="verticalLine"
          x1="50%"
          y1="45%"
          x2="50%"
          y2="55%"
          stroke="white"
          stroke-width="2"
        />
        <line
          id="horizontalLine"
          x1="47%"
          y1="50%"
          x2="53%"
          y2="50%"
          stroke="white"
          stroke-width="2"
        />
        <filter id="blurFilterRect" y="-50" x="-50" height="70" width="60">
          <feGaussianBlur in="SourceGraphic" stdDeviation="3" />
        </filter>
        <filter id="blurFilterEllipse" y="-50" x="-50" height="70" width="60">
          <feGaussianBlur in="SourceGraphic" stdDeviation="3.5" />
        </filter>
        <filter id="blurFilterCircle" y="-50" x="-50" height="70" width="60">
          <feGaussianBlur in="SourceGraphic" stdDeviation="4" />
        </filter>
        <g id="shape">
          <ellipse
            cx="3"
            cy="11"
            rx="11"
            ry="8"
            style="stroke: #000; fill: #000; filter: url(#blurFilterCircle)"
          />
          <rect
            x="1"
            y="3"
            width="4"
            height="16"
            style="fill: #000; stroke: #000; filter: url(#blurFilterRect)"
          ></rect>
          <ellipse
            cx="-4"
            cy="11"
            rx="3"
            ry="10"
            style="stroke: #fff; fill: #fff; filter: url(#blurFilterEllipse)"
          />
          <ellipse
            cx="10"
            cy="11"
            rx="3"
            ry="10"
            style="stroke: #fff; fill: #fff; filter: url(#blurFilterEllipse)"
          />
        </g>
      </defs>
      <g ref="disruptorGroupRef" v-show="isShowDisruptorGroup"></g>
      <g ref="shapeGroupRef" v-show="isShowGraphGroup"></g>
      <use xlink:href="#verticalLine"></use>
      <use xlink:href="#horizontalLine"></use>
    </svg>
    <div class="btn-container">
      <el-button
        type="primary"
        style="margin-left: 16px"
        @click="() => (isShowDisruptorGroup = !isShowDisruptorGroup)"
      >
        {{ isShowDisruptorGroup ? "隐藏混淆物" : "显示混淆物" }}
      </el-button>
      <el-button
        type="primary"
        style="margin-left: 16px"
        @click="() => (isShowGraphGroup = !isShowGraphGroup)"
      >
        {{ isShowGraphGroup ? "隐藏目标图形" : "显示目标图形" }}
      </el-button>
      <el-button type="primary" style="margin-left: 16px" @click="draw">
        重新生成
      </el-button>
      <el-button type="primary" style="margin-left: 16px" @click="openDrawer">
        配置运动参数
      </el-button>
    </div>
    <ConfigDrawer
      v-model:isShow="isShowDrawer"
      v-model:formData="config"
      @save="resetConfig"
    />
  </div>
</template>

<script>
import { ref, onMounted, nextTick } from "vue";
import { ElButton } from "element-plus";
import ConfigDrawer from "./ConfigDrawer.vue";
// import Gometry from "./gometry.js";
export default {
  components: { ElButton, ConfigDrawer },
  setup() {
    const isClear = ref(true);
    const svgRef = ref(null);
    const shapeGroupRef = ref(null);
    const disruptorGroupRef = ref(null);
    const isShowDisruptorGroup = ref(true);
    const isShowGraphGroup = ref(true);
    const isShowDrawer = ref(false);
    const shapeSize = 24; // 小矩形的大小
    const shapeRotateAngleOffset = 20; // 矩形颗粒角度偏移 [0,50,10,12.5,15,16,17,18,19,20]
    const maxOffset = 100; // 最大偏移
    const disruptorNum = 800; // 干扰物数量
    const containerWidth = ref(null);
    const containerHeight = ref(null);
    const animationTimer = ref(null);
    const drawRectSpeed = 1000000;
    let drawnRects = []; // 用于存储已绘制小矩形的位置
    let disruptorElList = []; // 用于即将绘制小矩形的dom
    let shapeElList = []; // 用于即将绘制小矩形的dom
    let disruptorFragment = document.createDocumentFragment();
    let shapeFragment = document.createDocumentFragment();
    let spacing = 50;
    let marginSize = 10; // 图形距离屏幕边线的距离
    let shapeRotateCenter = {
      x: 0,
      y: 0,
    };
    const config = ref({
      targetPosition: "second", //目标位置  1、2、3、4象限、中心、随机
      targetPositionType: "Random",
      targetModel: "Square", //目标类型 园/三角形/正方形
      targetModelType: "Random",
      targetRadius: 100, //目标半径 S1.1倍/L1.2倍
      targetRadiusType: "Random",
      targetSize: 4, //目标边线颗粒数(目标大小) S1.1倍/L1.2倍
      targetSizeType: "Random",
      shapeSpacing: 30, //目标颗粒间距
      shapeSpacingType: "Random",
      targetOffsetAngle: 0, //目标偏移角度 0/5/10/12.5/15/16/17/18/19/20
      targetOffsetAngleType: "Random",
      disruptorBoxDensity: 50, //干扰物密度 也可表示干扰物数目  400/500/600
      disruptorBoxDensityType: "Random",
    });
    // 画具体的图形
    function generateShapeData() {
      let {
        targetPositionType,
        targetModelType,
        targetRadiusType,
        targetSizeType,
        shapeSpacingType,
        targetOffsetAngleType,
        disruptorBoxDensityType,
      } = config.value;
      if (targetPositionType === "Random") {
        const list = ["first", "second", "third", "fourth", "center"];
        const i = randomNum(0, 4);
        config.value.targetPosition = list[i];
      }
      if (targetModelType === "Random") {
        const list = ["Circle", "Triangle", "Square"];
        const i = randomNum(0, 2);
        config.value.targetModel = list[i];
      }
      if (targetRadiusType === "Random") {
        config.value.targetRadius = randomNum(40, 180);
      }
      if (targetSizeType === "Random") {
        config.value.targetSize = randomNum(2, 8);
      }
      if (shapeSpacingType === "Random") {
        config.value.shapeSpacing = randomNum(10, 80);
      }
      if (targetOffsetAngleType === "Random") {
        config.value.targetOffsetAngle = randomNum(0, 180);
      }
      if (disruptorBoxDensityType === "Random") {
        config.value.disruptorBoxDensity = randomNum(30, 100);
      }
      console.log("config.value:", config.value);
      const type = config.value.targetModel;
      switch (type) {
        // 圆形
        case "Circle":
          generateCircleData();
          break;
        // 三角形
        case "Triangle":
          generateTriangleData();
          break;
        // 正方形
        case "Square":
          generateSquareData();
          break;
        // 椭圆
        case "ellipse":
          // generateEllipse(
          //   params.x,
          //   params.y,
          //   params.rx,
          //   config.value.targetSize
          // );
          break;

        // 梯形
        case "trapezoid":
          // generateTrapezoid(
          //   params.x,
          //   params.y,
          //   params.topWidth,
          //   params.bottomWidth,
          //   params.height
          // );
          break;
        default:
          break;
      }
    }

    // 圆形
    function generateCircleData() {
      // 颗粒之间的间距
      const shapeSpacing = config.value.shapeSpacing;
      // 圆形半径
      const targetRadius = config.value.targetRadius;
      // 放置方位
      const targetPosition = config.value.targetPosition;
      let p = {
        x: 0,
        y: 0,
        radius: targetRadius,
      };
      if (targetPosition === "random") {
        p.x = randomNum(targetRadius, containerWidth.value - targetRadius);
        p.y = randomNum(targetRadius, containerHeight.value - targetRadius);
      }
      if (targetPosition === "center") {
        p.x = containerWidth.value / 2 - shapeSize / 2 + 1;
        p.y = containerHeight.value / 2 - shapeSize / 2 + 1;
      }
      if (targetPosition === "first") {
        p.x = randomNum(
          containerWidth.value / 2 + targetRadius,
          containerWidth.value - targetRadius - marginSize
        );
        p.y = randomNum(
          targetRadius + marginSize,
          containerHeight.value / 2 - targetRadius
        );
      }
      if (config.value.targetPosition === "second") {
        p.x = randomNum(
          targetRadius + marginSize,
          containerWidth.value / 2 - targetRadius
        );
        p.y = randomNum(
          targetRadius + marginSize,
          containerHeight.value / 2 - targetRadius
        );
      }
      if (config.value.targetPosition === "third") {
        p.x = randomNum(
          targetRadius + marginSize,
          containerWidth.value / 2 - targetRadius
        );
        p.y = randomNum(
          containerHeight.value / 2,
          containerHeight.value - targetRadius - marginSize
        );
      }
      if (config.value.targetPosition === "fourth") {
        p.x = randomNum(
          containerWidth.value / 2 + targetRadius,
          containerWidth.value - targetRadius - marginSize
        );
        p.y = randomNum(
          containerHeight.value / 2,
          containerHeight.value - targetRadius - marginSize
        );
      }
      if (p.x < targetRadius + marginSize || p.y < targetRadius + marginSize) {
        generateShapeData();
        return;
      }
      if (
        p.x > containerWidth.value - targetRadius - marginSize ||
        p.y > containerHeight.value - targetRadius - marginSize
      ) {
        generateShapeData();
        return;
      }
      // 保存旋转中心
      shapeRotateCenter = p;
      const steps = Math.ceil(
        (2 * Math.PI * targetRadius) / (shapeSize + shapeSpacing)
      );
      for (let i = 0; i < steps; i++) {
        const angle = (i / steps) * 2 * Math.PI;
        const x = p.x + targetRadius * Math.cos(angle);
        const y = p.y + targetRadius * Math.sin(angle);
        generateRectDom(x, y, angle * (180 / Math.PI));
      }
    }

    // 椭圆
    function generateEllipse(cx, cy, rx, ry) {
      const steps = Math.ceil(
        (2 * Math.PI * Math.sqrt((rx * rx + ry * ry) / 2)) /
          (shapeSize + spacing)
      );
      for (let i = 0; i < steps; i++) {
        const angle = (i / steps) * 2 * Math.PI;
        const x = cx + rx * Math.cos(angle);
        const y = cy + ry * Math.sin(angle);
        generateRectDom(x, y, angle * (180 / Math.PI));
      }
    }

    // 三角形
    function generateTriangleData() {
      // 三个顶点A(x1, y1)、B(x2, y2)、C(x3, y3)，
      // 重心的x坐标 xg = (x1 + x2 + x3) / 3 重心的y坐标 yg = (y1 + y2 + y3) / 3

      const shapeCount = config.value.targetSize;
      // 颗粒之间的间距
      const shapeSpacing = config.value.shapeSpacing;
      // 边线的长度
      const lineLength = (shapeSize + shapeSpacing) * (shapeCount - 1);
      // 放置方位
      const targetPosition = config.value.targetPosition;
      // 假设p1为坐标系中心点
      let p1 = {
        x: 0,
        y: 0,
      };
      let p2 = {
        x: lineLength,
        y: 0,
      };
      let p3 = {
        x: lineLength / 2,
        y: (lineLength / 2) * Math.sqrt(3),
      };
      let p = {
        x: (p1.x, p2.x, p3.x) / 3,
        y: (p1.y, p2.y, p3.y) / 3,
      };
      const radius = Math.sqrt(p.x * p.x + p.y * p.y);
      const offsetWidth = lineLength + marginSize + shapeSize + shapeSpacing;
      if (targetPosition === "random") {
        p = {
          x: randomNum(offsetWidth, containerWidth.value - offsetWidth),
          y: randomNum(offsetWidth, containerHeight.value - offsetWidth),
        };
      }
      if (targetPosition === "center") {
        p = {
          x: containerWidth.value / 2,
          y: containerHeight.value / 2,
        };
      }
      if (config.value.targetPosition === "first") {
        p.x = randomNum(
          containerWidth.value / 2 + offsetWidth,
          containerWidth.value - offsetWidth
        );
        p.y = randomNum(offsetWidth, containerHeight.value / 2 - offsetWidth);
      }
      if (config.value.targetPosition === "second") {
        p.x = randomNum(offsetWidth, containerWidth.value / 2 - offsetWidth);
        p.y = randomNum(offsetWidth, containerHeight.value / 2 - offsetWidth);
      }
      if (config.value.targetPosition === "third") {
        p.x = randomNum(offsetWidth, containerWidth.value / 2 - offsetWidth);
        if (
          containerHeight.value / 2 + offsetWidth <
          containerHeight.value - offsetWidth
        ) {
          p.y = randomNum(
            containerHeight.value / 2 + offsetWidth,
            containerHeight.value - offsetWidth
          );
        } else {
          p.y = randomNum(
            containerHeight.value - offsetWidth - offsetWidth / 2,
            containerHeight.value - offsetWidth
          );
        }
      }
      if (config.value.targetPosition === "fourth") {
        p.x = randomNum(
          containerWidth.value / 2 + offsetWidth,
          containerWidth.value - offsetWidth
        );
        if (
          containerHeight.value / 2 + offsetWidth <
          containerHeight.value - offsetWidth
        ) {
          p.y = randomNum(
            containerHeight.value / 2 + offsetWidth,
            containerHeight.value - offsetWidth
          );
        } else {
          p.y = randomNum(
            containerHeight.value - offsetWidth - offsetWidth / 2,
            containerHeight.value - offsetWidth
          );
        }
      }
      console.log(
        `1====p.x:${p.x},p.y:${p.y},lineLength:${lineLength},offsetWidth:${offsetWidth},containerHeight:${containerHeight.value},containerWidth:${containerWidth.value}`
      );
      p1.x = p.x + p1.x - lineLength / 2 - shapeSize / 2;
      p1.y = p.y + p1.y + radius;

      p2.x = p.x + p2.x - lineLength / 2;
      p2.y = p1.y;

      if (p1.x < lineLength + marginSize + shapeSize) {
        const offsetX = lineLength + marginSize + shapeSize - p1.x;
        // p1.x += offsetX;
        // p2.x += offsetX;
        p1.x += lineLength + offsetX;
        p2.x += lineLength + offsetX;
      }
      if (p2.x > containerWidth.value - lineLength - marginSize - shapeSize) {
        const offsetX =
          p2.x - (containerWidth.value - lineLength - marginSize - shapeSize);
        // p1.x -= offsetX;
        // p2.x -= offsetX;
        p1.x -= lineLength + offsetX;
        p2.x -= lineLength + offsetX;
      }
      if (p1.y < lineLength + marginSize + shapeSize) {
        const offsetY = lineLength + marginSize + shapeSize - p1.y;
        // p1.y += offsetY;
        // p2.y += offsetY;
        p1.y += lineLength + offsetY;
        p2.y += lineLength + offsetY;
      }
      if (p2.y > containerHeight.value - lineLength - marginSize - shapeSize) {
        const offsetY =
          p2.y - (containerHeight.value - lineLength - marginSize - shapeSize);
        // p1.y -= offsetY;
        // p2.y -= offsetY;
        p1.y -= lineLength + offsetY;
        p2.y -= lineLength + offsetY;
      }

      p3 = {
        x: (p2.x - p1.x) / 2,
        y: ((p2.x - p1.x) / 2) * Math.sqrt(3),
      };
      if (p3.y < lineLength + marginSize + shapeSize) {
        const offsetY = lineLength + marginSize + shapeSize - p3.y;
        // p1.y += offsetY;
        // p2.y += offsetY;
        p1.y += lineLength + offsetY;
        p2.y += lineLength + offsetY;
      }
      console.log(
        `2====p.x:${p.x},p.y:${p.y},lineLength:${lineLength},containerHeight:${containerHeight.value},containerWidth:${containerWidth.value}`
      );
      // 保存旋转中心
      shapeRotateCenter = p;
      // if (p1.x < lineLength + marginSize || p1.y < lineLength + marginSize) {
      //   generateShapeData();
      //   return;
      // }
      // if (
      //   p2.x > containerWidth.value - lineLength - marginSize ||
      //   p2.y > containerHeight.value - lineLength - marginSize
      // ) {
      //   generateShapeData();
      //   return;
      // }
      // 下边线
      generateLineData(p1.x, p1.y, 0, 90, shapeCount - 1);
      // 左边线
      generateLineData(
        p1.x + shapeSize / 4,
        p1.y - shapeSize / 4,
        60,
        30,
        shapeCount
      );
      // 右边线
      generateLineData(p2.x, p2.y - shapeSize / 2 - 4, -60, -30, shapeCount);
    }

    // 梯形
    function generateTrapezoid(cx, cy, topWidth, bottomWidth, height) {
      const halfTopWidth = topWidth / 2;
      const halfBottomWidth = bottomWidth / 2;
      const halfHeight = height / 2;
      generateLineData(
        cx - halfBottomWidth,
        cy + halfHeight,
        cx + halfBottomWidth,
        cy + halfHeight
      );
      generateLineData(
        cx + halfBottomWidth,
        cy + halfHeight,
        cx + halfTopWidth,
        cy - halfHeight
      );
      generateLineData(
        cx + halfTopWidth,
        cy - halfHeight,
        cx - halfTopWidth,
        cy - halfHeight
      );
      generateLineData(
        cx - halfTopWidth,
        cy - halfHeight,
        cx - halfBottomWidth,
        cy + halfHeight
      );
    }

    // 正方形
    function generateSquareData() {
      // 目标位置
      const targetPosition = config.value.targetPosition;
      // 边线上小颗粒的数量
      const shapeCount = config.value.targetSize;
      // 颗粒之间的间距
      const shapeSpacing = config.value.shapeSpacing;
      // 边线的长度
      const lineLength = (shapeSize + shapeSpacing) * shapeCount - shapeSpacing;
      let p = {
        x: 0,
        y: 0,
      };
      if (targetPosition === "random") {
        shapeRotateCenter.x = randomNum(0, containerWidth.value - lineLength);
        shapeRotateCenter.y = randomNum(0, containerHeight.value - lineLength);
      }
      if (targetPosition === "center") {
        shapeRotateCenter = {
          x: containerWidth.value / 2,
          y: containerHeight.value / 2,
        };
        p.x = shapeRotateCenter.x - lineLength / 2 + shapeSize / 2 - 3;
        p.y = shapeRotateCenter.y - lineLength / 2;
      }
      if (targetPosition === "first") {
        p.x = randomNum(
          containerWidth.value / 2,
          containerWidth.value - lineLength
        );
        p.y = randomNum(0 + marginSize, containerHeight.value / 2 - lineLength);
        shapeRotateCenter = {
          x: p.x + lineLength / 2,
          y: p.y + lineLength / 2,
        };
      }
      if (targetPosition === "second") {
        p.x = randomNum(0 + marginSize, containerWidth.value / 2 - lineLength);
        p.y = randomNum(0 + marginSize, containerHeight.value / 2 - lineLength);
        shapeRotateCenter = {
          x: p.x + lineLength / 2,
          y: p.y + lineLength / 2,
        };
      }
      if (targetPosition === "third") {
        p.x = randomNum(0 + marginSize, containerWidth.value / 2 - lineLength);
        p.y = randomNum(
          containerHeight.value / 2,
          containerHeight.value - lineLength
        );
        shapeRotateCenter = {
          x: p.x + lineLength / 2,
          y: p.y + lineLength / 2,
        };
      }
      if (targetPosition === "fourth") {
        p.x = randomNum(
          containerWidth.value / 2,
          containerWidth.value - lineLength
        );
        p.y = randomNum(
          containerHeight.value / 2,
          containerHeight.value - lineLength
        );
        shapeRotateCenter = {
          x: p.x + lineLength / 2,
          y: p.y + lineLength / 2,
        };
      }

      let rightX = p.x + lineLength;
      let leftX = p.x;
      let topY = p.y;
      let buttomY = p.y + lineLength;
      if (rightX > containerWidth.value) {
        rightX = containerWidth.value - 5;
        leftX = containerWidth.value - lineLength;
      }
      if (buttomY > containerHeight.value) {
        buttomY = containerHeight.value - 5;
        topY = containerHeight.value - lineLength;
      }

      if (leftX < lineLength + marginSize || topY < lineLength + marginSize) {
        generateShapeData();
        return;
      }
      if (
        rightX > containerWidth.value - lineLength - marginSize ||
        buttomY < containerHeight.value - lineLength - marginSize
      ) {
        generateShapeData();
        return;
      }
      // 上边线
      generateLineData(leftX, topY, 0, 90, shapeCount - 1);
      // 右边线
      generateLineData(rightX - shapeSize, topY, -90, 0, shapeCount - 1);
      // 下边线
      generateLineData(
        rightX - shapeSize,
        buttomY - shapeSize,
        180,
        90,
        shapeCount - 1
      );
      // 左边线
      generateLineData(leftX, buttomY - shapeSize, 90, 0, shapeCount - 1);
    }

    // 沿着某个角度，画多少个颗粒矩形
    function generateLineData(x, y, lineAngle, shapeRotateAngle, size) {
      // 颗粒之间的间距
      const shapeSpacing = config.value.shapeSpacing;
      const startX = x;
      const startY = y;
      for (let i = 0; i < size; i++) {
        if (lineAngle === 0) {
          if (i === 0) {
            x = startX;
          } else {
            x = startX + i * (shapeSize + shapeSpacing);
          }
        }
        if (lineAngle === 60) {
          let l = i * (shapeSpacing + shapeSize);
          x = startX + l * Math.cos((lineAngle * Math.PI) / 180);
          y = startY - l * Math.sin((lineAngle * Math.PI) / 180);
        }
        if (lineAngle === -60) {
          let l = i * (shapeSpacing + shapeSize);
          x = startX - l * Math.cos((lineAngle * Math.PI) / 180);
          y = startY + l * Math.sin((lineAngle * Math.PI) / 180);
        }
        if (lineAngle === 180) {
          x = startX - i * (shapeSize + shapeSpacing);
        }
        if (lineAngle === 90) {
          y = startY - i * (shapeSize + shapeSpacing);
        }
        if (lineAngle === -90) {
          y = startY + i * (shapeSize + shapeSpacing);
        }
        generateRectDom(x, y, shapeRotateAngle);
      }
    }

    // 画基础矩形
    function generateRectDom(x, y, angle, wrapName) {
      const { targetModel } = config.value;

      // 创建<use>元素
      const rectEl = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "use"
      );
      // 设置属性
      rectEl.setAttributeNS(
        "http://www.w3.org/1999/xlink",
        "xlink:href",
        "#shape"
      );
      if (angle === 90 && targetModel === "Square") {
        x = x - shapeSize / 2 + 2;
        y = y + shapeSize / 2 - 4;
      }

      // const offsetAngle = randomNum(0, shapeRotateAngleOffset);
      const offsetAngle = shapeRotateAngleOffset;
      const k = Math.random() < 0.5 ? -1 : 1;
      const rotateAngle = angle + offsetAngle * k;
      rectEl.setAttribute("x", x);
      rectEl.setAttribute("y", y);
      rectEl.setAttribute(
        "transform",
        `rotate(${rotateAngle}, ${x + shapeSize / 2}, ${y + shapeSize / 2})`
      );
      if (!disruptorFragment) {
        disruptorFragment = document.createDocumentFragment();
      }
      if (!shapeFragment) {
        shapeFragment = document.createDocumentFragment();
      }
      if (wrapName === "disruptor") {
        disruptorFragment.appendChild(rectEl);
      } else {
        const rect = {
          x: x,
          y: y,
          width: shapeSize,
          height: shapeSize,
          angle: angle,
        };
        const flag = drawnRects.some((item) => intersects(rect, item));
        if (!flag) {
          shapeFragment.appendChild(rectEl);
          drawnRects.push(rect);
        }
      }
    }
    function fillScreenWithRects_bak() {
      // const step = shapeSize + spacing;
      // for (let x = shapeSize / 2; x < containerWidth.value; x += step) {
      //   for (let y = shapeSize / 2; y < containerHeight.value; y += step) {
      //     const angle = randomNum(0, 160);
      //     let offsetX = randomNum(0, maxOffset);
      //     let offsetY = randomNum(0, maxOffset);
      //     const rect = {
      //       x: x + offsetX,
      //       y: y + offsetY,
      //       width: shapeSize,
      //       height: shapeSize,
      //       angle: angle,
      //     };
      //     generateRectDom(rect.x, rect.y, rect.angle, "disruptor");
      //   }
      // }
    }
    // 生成干扰物
    function fillScreenWithRects() {
      let i = 0;
      let f = 0;
      const intersectSize = config.value.disruptorBoxDensity;

      const maxIntersectNum = 1000;
      while (i < disruptorNum && f < maxIntersectNum) {
        const randomX = randomNum(
          marginSize,
          containerWidth.value - marginSize
        );
        const randomY = randomNum(
          marginSize,
          containerHeight.value - marginSize
        );
        const randomAngle = randomNum(0, 360);
        const rect = {
          x: randomX,
          y: randomY,
          width: intersectSize,
          height: intersectSize,
          angle: randomAngle,
        };
        const flag = drawnRects.some((item) => intersects(rect, item));
        if (flag) {
          f++;
        } else {
          generateRectDom(rect.x, rect.y, rect.angle, "disruptor");
          drawnRects.push(rect);
          i++;
          f = 0;
        }
      }
    }
    function hitRectAndRect(rect1, rect2) {
      // const Rect1 = new Gometry.Rect(
      //   rect1.x,
      //   rect1.y,
      //   rect1.width,
      //   rect1.height,
      //   rect1.angle
      // );
      // const Rect2 = new Gometry.Rect(
      //   rect2.x,
      //   rect2.y,
      //   rect2.width,
      //   rect2.height,
      //   rect2.angle
      // );
      // return Gometry.Intersect.rectRectIntersect(Rect1, Rect2);
    }

    function intersects(rect1, rect2) {
      const rect1Corners = getRotatedCorners(rect1);
      const rect2Corners = getRotatedCorners(rect2);

      return checkPolygonIntersection(rect1Corners, rect2Corners);
    }
    function getRotatedCorners(rect) {
      const cx = rect.x + rect.width / 2;
      const cy = rect.y + rect.height / 2;
      const angle = rect.angle * (Math.PI / 180);

      const corners = [
        { x: rect.x, y: rect.y },
        { x: rect.x + rect.width, y: rect.y },
        { x: rect.x + rect.width, y: rect.y + rect.height },
        { x: rect.x, y: rect.y + rect.height },
      ];

      return corners.map((corner) => {
        const dx = corner.x - cx;
        const dy = corner.y - cy;
        return {
          x: cx + dx * Math.cos(angle) - dy * Math.sin(angle),
          y: cy + dx * Math.sin(angle) + dy * Math.cos(angle),
        };
      });
    }
    function checkPolygonIntersection(poly1, poly2) {
      const polygons = [poly1, poly2];
      let minA, maxA, projected, i, i1, j, minB, maxB;

      for (i = 0; i < polygons.length; i++) {
        const polygon = polygons[i];
        for (i1 = 0; i1 < polygon.length; i1++) {
          const i2 = (i1 + 1) % polygon.length;
          const p1 = polygon[i1];
          const p2 = polygon[i2];

          const normal = { x: p2.y - p1.y, y: p1.x - p2.x };

          minA = maxA = undefined;
          for (j = 0; j < poly1.length; j++) {
            projected = normal.x * poly1[j].x + normal.y * poly1[j].y;
            if (minA === undefined || projected < minA) {
              minA = projected;
            }
            if (maxA === undefined || projected > maxA) {
              maxA = projected;
            }
          }

          minB = maxB = undefined;
          for (j = 0; j < poly2.length; j++) {
            projected = normal.x * poly2[j].x + normal.y * poly2[j].y;
            if (minB === undefined || projected < minB) {
              minB = projected;
            }
            if (maxB === undefined || projected > maxB) {
              maxB = projected;
            }
          }

          if (maxA < minB || maxB < minA) {
            return false;
          }
        }
      }
      return true;
    }
    function getRandomColor() {
      const letters = "0123456789ABCDEF";
      let color = "#";
      for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    }
    function drawRect() {
      const { targetOffsetAngle, targetModel } = config.value;
      shapeGroupRef.value.appendChild(shapeFragment);
      if (targetModel !== "Circle") {
        shapeGroupRef.value.style.transform = `rotate(${targetOffsetAngle}deg)`;
        shapeGroupRef.value.style.transformOrigin = `${shapeRotateCenter.x}px ${shapeRotateCenter.y}px`;
      }
      disruptorGroupRef.value.appendChild(disruptorFragment);

      // let i = 0;
      // while (i < drawRectSpeed) {
      //   if (shapeElList && shapeElList.length) {
      //     const k = randomNum(0, shapeElList.length);
      //     if (shapeElList[k]) {
      //       shapeGroupRef.value.appendChild(shapeElList[k]);
      //     }
      //     shapeElList.splice(k, 1);
      //   }
      //   if (disruptorElList && disruptorElList.length) {
      //     const k = randomNum(0, disruptorElList.length);
      //     if (disruptorElList[k]) {
      //       disruptorGroupRef.value.appendChild(disruptorElList[k]);
      //     }
      //     disruptorElList.splice(k, 1);
      //   }
      //   i++;
      // }
      // if (!shapeElList.length && !disruptorElList.length) return;
      // // 刷新视图
      // animationTimer.value = requestAnimationFrame(drawRect);
    }
    function draw() {
      // 清除之前的形状
      shapeGroupRef.value.innerHTML = "";
      disruptorGroupRef.value.innerHTML = "";
      shapeElList = [];
      disruptorElList = [];
      drawnRects = [];
      // 生成图形数据
      generateShapeData();
      // 生成干扰物数据
      fillScreenWithRects();
      // 画小矩形
      drawRect();
      addWhiteLine();
    }
    function addWhiteLine() {
      // 创建<use>元素
      let whiteLineList = ["verticalLine", "horizontalLine"];
      for (let i = 0; i < 2; i++) {
        const rectEl = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "use"
        );
        // 设置属性
        rectEl.setAttributeNS(
          "http://www.w3.org/1999/xlink",
          "xlink:href",
          `#${whiteLineList[i]}`
        );
        svgRef.value.appendChild(rectEl);
      }
    }
    function randomNum(minNum, maxNum) {
      switch (arguments.length) {
        case 1:
          return parseInt(Math.random() * minNum + 1, 10);
          break;
        case 2:
          return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
          break;
        default:
          return 0;
          break;
      }
    }
    function openDrawer() {
      isShowDrawer.value = true;
    }
    async function resetConfig(data) {
      config.value = {
        ...data,
      };
      // spacing = 100 - config.value.disruptorBoxDensity;
      draw();
    }
    onMounted(() => {
      containerWidth.value = svgRef.value.clientWidth;
      containerHeight.value = svgRef.value.clientHeight;
      draw();
    });

    return {
      svgRef,
      disruptorGroupRef,
      shapeGroupRef,
      config,
      isShowDrawer,
      openDrawer,
      resetConfig,
      isClear,
      draw,
      isShowGraphGroup,
      isShowDisruptorGroup,
    };
  },
};
</script>

<style scoped>
.game-container {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgb(128, 128, 128) !important;

  .btn-container {
    position: absolute;
    top: 15px;
    right: 15px;
  }
}
</style>

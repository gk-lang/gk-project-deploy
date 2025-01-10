<template>
  <div class="ball">
    <p v-if="!isFinishBallBlink" class="start-guidance-text">
      请追踪下面蓝色圆环标记的小球
    </p>
    <p v-if="isFinishBallMove" class="end-guidance-text">
      用鼠标点击你刚才追踪的小球
    </p>
    <canvas ref="canvasRef"></canvas>
    <!-- <el-button type="primary" @click="clear">清除</el-button>
    <el-button type="primary" @click="draw">绘制</el-button> -->
    <el-button type="primary" @click="startOrStopBallMove">{{
      ballMoving ? "暂停" : "开始"
    }}</el-button>
    <el-button type="primary" @click="resetBallMove"> 重置运动 </el-button>
    <!-- <el-button type="primary" @click="showTargetBall">
      {{ isShowTargetBall ? "混淆目标小球" : "显示目标小球" }}
    </el-button> -->
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { ElMessage,ElButton } from "element-plus";
const canvasRef = ref();
const ctx = ref({});
const animationTimer = ref("");
const Timer = ref("");
const ballMoving = ref(false);
const isShowTargetBall = ref(false);
const isShowMoveRangeReact = ref(false);
const isFinishBallBlink = ref(false); //是否此轮小球闪烁完成
const isFinishBallMove = ref(false); //是否此轮小球移动完成
const clickMarkerPosition = ref(null);
const clickMarkerPositionList = ref([]);
const config = ref({
  ballMoveRangeHeight: 700, //小球运动范围-高度
  ballMoveRangeWidth: 1200, //小球运动范围-宽度
  ellipseMajorAxis: 300, //初始椭圆长轴
  ellipseMinorAxis: 200, //初始椭圆短轴
  ballMoveDuration: 8000, // 小球运动时间(多少ms后停止运动)
  ballRadius: 30, //小球半径
  ballNum: 8, //小球总数
  targetBallNum: 2, //目标小球个数
  ballMoveSpeed: 8, //小球运动速度
  ballColliRadius: 60, //小球碰撞半径
  ballDefaultBgColor: "rgba(0,0,0,0.2)", //小球默认背景色
  targetBallBlinkDuration: 2000, //追踪小球闪烁时长(ms)
  targetBallBlinkCount: 2, //追踪小球闪烁次数
  targetBallBlinkBorderColor: "rgba(30, 144, 255, 1)", //追踪小球闪烁时边框颜色
  blinkToMoveSilentTime: 300, //小球闪烁停止到运动时的静止时间(ms)
  viewBGColor: "#CCC", //视窗背景颜色
});
/**
 * 定义小球大小，颜色
 */
const ballArr = ref([]);
const blinkBallList = ref([]);

onMounted(() => {
  canvasRef.value.width = window.innerWidth;
  canvasRef.value.height = window.innerHeight;
  ctx.value = canvasRef.value.getContext("2d");

  resetBallMove();
  // 监听窗口变化
  window.onresize = resetCanvasSize;
  // 监听canvas的点击事件
  canvasRef.value.addEventListener("click", handleCanvasClick);
});

function drawColorfulBackground() {
  const squareSize = 14; // 每个方格的大小
  const numRows = canvasRef.value.height / squareSize;
  const numCols = canvasRef.value.width / squareSize;

  for (let row = 0; row < numRows; row++) {
    for (let col = 0; col < numCols; col++) {
      if ((row + col) % 2 === 0) {
        ctx.value.fillStyle = "red";
      } else {
        ctx.value.fillStyle = "green";
      }
      ctx.value.fillRect(
        col * squareSize,
        row * squareSize,
        squareSize,
        squareSize
      );
    }
  }
}

function resetBallMove() {
  if (animationTimer.value) {
    cancelAnimationFrame(animationTimer.value);
  }
  isFinishBallBlink.value = false;
  isFinishBallMove.value = false;
  // 重置后不显示小球运动范围框
  isShowMoveRangeReact.value = false;
  // 重置后不显示目标小球的颜色
  isShowTargetBall.value = false;
  // 清空点击标记圆点
  clickMarkerPosition.value = null;
  clickMarkerPositionList.value = [];
  // 清空前一帧元素
  ctx.value.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height);
  // 初始化小球移动速度
  initializeBalls();
  // 绘制小球
  drawBallOnEllipse({
    a: config.value.ellipseMajorAxis,
    b: config.value.ellipseMinorAxis,
  });
}

// 初始化小球速度
function initializeBalls() {
  ballArr.value = [];
  const {
    ballNum,
    targetBallNum,
    ballMoveSpeed,
    ballRadius,
    ballDefaultBgColor,
    targetBallActiveColor,
    viewBGColor,
    ballColliRadius,
  } = config.value;
  canvasRef.value.style.background = viewBGColor;

  // 设置小球相关配置属性
  for (let i = 0; i < ballNum; i++) {
    //生成0-360之间的随机数
    let angle = Math.floor(Math.random() * 361);

    const ballItem = {
      dx: Math.cos(angle) * ballMoveSpeed,
      dy: Math.sin(angle) * ballMoveSpeed,
      r: ballRadius,
      fillStyle: ballDefaultBgColor,
      strokeStyle: targetBallActiveColor,
      lineWidth: 0,
      colliRadius: ballColliRadius,
      opacity: 1,
      isTarget: false,
    };
    ballArr.value.push(ballItem);
  }
  // 随机指定需要追踪的小球
  let targetCount = 0;
  let randomIndices = [];
  while (targetCount < targetBallNum) {
    // 生成 0 到 n-1 之间的整数：
    const randomIndex = Math.floor(Math.random() * ballArr.value.length);
    //确保小球位置不相邻
    if (!randomIndices.includes(randomIndex)) {
      let isAdjacent = false;
      for (let index of randomIndices) {
        if (
          Math.abs(index - randomIndex) === 1 ||
          Math.abs(index - randomIndex) === 7
        ) {
          isAdjacent = true;
          break;
        }
      }
      if (!isAdjacent) {
        randomIndices.push(randomIndex);
        const item = ballArr.value[randomIndex];
        if (!item.isTarget) {
          item.isTarget = true;
          targetCount++;
        }
      }
    }
  }
}

// 把小球均匀的绘制到椭圆边线上
function drawBallOnEllipse({ x, y, a, b }) {
  // 保存当前画布状态
  ctx.value.save();
  // 计算canvas的中心点
  const centerX = canvasRef.value.width / 2;
  const centerY = canvasRef.value.height / 2;

  if (!x) x = centerX;
  if (!y) y = centerY;

  // 椭圆中心x,y
  const originX = x;
  const originY = y;

  const balllength = ballArr.value.length;
  for (let i = 0; i < balllength; i++) {
    const ball = ballArr.value[i];
    // 计算每个小球的起始角度
    ball.angle = (i / balllength) * 2 * Math.PI;

    // 计算小球中心位置坐标
    ball.x = originX + a * Math.cos(ball.angle);
    ball.y = originY + b * Math.sin(ball.angle);
  }
  draw();
  // 恢复画布状态
  ctx.value.restore();
}

// 绘制所有图形
function draw() {
  ctx.value.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height);
  drawColorfulBackground()
  // drawEllipse({ x: canvasRef.value.width / 2, y: canvasRef.value.height / 2, a: 200, b: 100, angle: Math.PI / 4 });
  // 绘制小球运动范围框口
  if (isShowMoveRangeReact.value) {
    const { ballMoveRangeWidth, ballMoveRangeHeight } = config.value;
    // 计算canvas的中心点
    const centerX = canvasRef.value.width / 2;
    const centerY = canvasRef.value.height / 2;
    // 计算边界坐标
    const rangeLeftX = centerX - ballMoveRangeWidth / 2;
    const rangeTopY = centerY - ballMoveRangeHeight / 2;
    ctx.value.lineWidth = 1;
    ctx.value.strokeStyle = "#3498db";
    ctx.value.strokeRect(
      rangeLeftX,
      rangeTopY,
      ballMoveRangeWidth,
      ballMoveRangeHeight
    );
  }
  // 绘制正常小球
  ballArr.value.forEach((ball) => {
    ctx.value.globalAlpha = ball.opacity;
    ctx.value.beginPath();
    ctx.value.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
    ctx.value.closePath();

    if (ball.lineWidth) {
      console.log('11',ball.r,ball.lineWidth);
      ctx.value.lineWidth = ball.lineWidth || 0; //边框宽度
      ctx.value.strokeStyle = ball.strokeStyle || ""; //边框颜色
      ctx.value.stroke(); // 描边路径
      ctx.value.strokeStyle = "";
    }

    if (ball.fillStyle) {
      ctx.value.fillStyle = ball.fillStyle; // 填充颜色
      ctx.value.fill(); // 填充路径
    }

    ctx.value.globalAlpha = 1; // Reset global alpha
  });
  // 绘制闪烁中的小球
  blinkBallList.value.forEach((ball) => {
    ctx.value.globalAlpha = ball.opacity;
    ctx.value.beginPath();
    ctx.value.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
    ctx.value.closePath();

    if (ball.lineWidth) {
      console.log('22',ball.lineWidth);
      ctx.value.lineWidth = ball.lineWidth || 0;
      ctx.value.strokeStyle = ball.strokeStyle || "";
      ctx.value.stroke();
      ctx.value.strokeStyle = "";
    }

    // if (ball.fillStyle) {
    //   ctx.value.fillStyle = ball.fillStyle;
    //   ctx.value.fill();
    // }

    // ctx.value.globalAlpha = 1; // Reset global alpha
  });
  //绘制点击小圆点
  if (clickMarkerPositionList.value.length) {
    clickMarkerPositionList.value.forEach((clickMarker) => {
      const { x, y, r, bgColor } = clickMarker;
      // 绘制标记的点
      ctx.value.beginPath();
      ctx.value.arc(x, y, r, 0, Math.PI * 2);
      ctx.value.fillStyle = bgColor; // Color of the dot
      ctx.value.fill();
      ctx.value.closePath();
    });
  }
}

// 闪烁指定小球,callback:回调
function blinkBall(callback) {
  //闪烁次数
  const blinkCount = config.value.targetBallBlinkCount;
  //闪烁周期
  const blinkDuration = config.value.targetBallBlinkDuration;
  //闪烁速度
  const blinkRate = blinkDuration / blinkCount / 2;
  let blinkCountIndex = 0;
  let isShowBlinkBall = true;

  blinkBallList.value = ballArr.value.filter((x) => x.isTarget);

  function changeBlinkBallStatus() {
    setTimeout(() => {
      isShowBlinkBall = !isShowBlinkBall;
      blinkCountIndex++;
      if (blinkCountIndex < blinkCount * 2) {
        changeBlinkBallStatus();
      } else {
        blinkBallList.value = [];
      }
    }, blinkRate);
  }

  function fade() {
    for (let i = 0; i < blinkBallList.value.length; i++) {
      const ball = blinkBallList.value[i];
      if (isShowBlinkBall) {
        ball.strokeStyle = config.value.targetBallBlinkBorderColor;
        ball.lineWidth = 15;
        ball.r = config.value.ballRadius - ball.lineWidth/2;
      } else {
        ball.strokeStyle = "";
        ball.lineWidth = 0;
        ball.r = config.value.ballRadius;
      }
    }
    draw();

    if (blinkCount * 2 <= blinkCountIndex) {
      callback();
    } else {
      // 刷新视图
      animationTimer.value = requestAnimationFrame(fade);
    }
  }

  fade();
  changeBlinkBallStatus();
}

//开始或者暂停小球运动
function startOrStopBallMove() {
  ballMoving.value = !ballMoving.value;
  if (ballMoving.value) {
    blinkBall(() => {
      // 让小球blinkToMoveSilentTime毫秒后，随机运动
      setTimeout(() => {
        isFinishBallBlink.value = true;
        randomMoveBall();
      }, config.value.blinkToMoveSilentTime);
      // 让小球ballMoveDuration毫秒后，停止运动
      setTimeout(() => {
        stopBallMove();
        isFinishBallMove.value = true;
      }, config.value.ballMoveDuration);
    });
  } else {
    stopBallMove();
  }
}

/**
 * 更新canvas实现动画效果
 */
function randomMoveBall() {
  // 移动小球
  moveBall();
  // 绘制小球
  draw();
  // 刷新视图
  animationTimer.value = requestAnimationFrame(randomMoveBall);
}

// 让小球随机移动
function moveBall() {
  const { ballMoveRangeWidth, ballMoveRangeHeight } = config.value;
  // 计算canvas的中心点
  const centerX = canvasRef.value.width / 2;
  const centerY = canvasRef.value.height / 2;
  // 计算边界坐标
  const rangeLeftX = centerX - ballMoveRangeWidth / 2;
  const rangeRightX = centerX + ballMoveRangeWidth / 2;
  const rangeTopY = centerY - ballMoveRangeHeight / 2;
  const rangeBottomY = centerY + ballMoveRangeHeight / 2;
  ballArr.value.forEach((ball) => {
    ball.x += ball.dx;
    ball.y += ball.dy;

    // 边界检测
    if (ball.x - ball.r < rangeLeftX || ball.x + ball.r > rangeRightX) {
      ball.dx = -ball.dx;

      // 边界溢出的情况
      if (ball.x - ball.r < rangeLeftX) {
        ball.x = rangeLeftX + ball.r;
      }
      if (ball.x + ball.r > rangeRightX) {
        ball.x = rangeRightX - ball.r;
      }
    }
    if (ball.y - ball.r < rangeTopY || ball.y + ball.r > rangeBottomY) {
      ball.dy = -ball.dy;

      // 边界溢出的情况
      if (ball.y - ball.r < rangeTopY) {
        ball.y = rangeTopY + ball.r;
      }
      if (ball.y + ball.r > rangeBottomY) {
        ball.y = rangeBottomY - ball.r;
      }
    }

    // 碰撞检测
    ballArr.value.forEach((otherBall) => {
      if (ball !== otherBall) {
        const dx = ball.x - otherBall.x;
        const dy = ball.y - otherBall.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < ball.colliRadius + otherBall.colliRadius) {
          const angle = Math.atan2(dy, dx);
          const totalSpeed =
            Math.sqrt(ball.dx * ball.dx + ball.dy * ball.dy) +
            Math.sqrt(
              otherBall.dx * otherBall.dx + otherBall.dy * otherBall.dy
            );
          ball.dx = Math.cos(angle) * totalSpeed * 0.5;
          ball.dy = Math.sin(angle) * totalSpeed * 0.5;
          otherBall.dx = -Math.cos(angle) * totalSpeed * 0.5;
          otherBall.dy = -Math.sin(angle) * totalSpeed * 0.5;
        }
      }
    });
  });
}

//暂停小球运动
function stopBallMove() {
  ballArr.value.forEach((x) => {
    if (x.isTarget) {
      x.r = config.value.ballRadius;
    }
  });
  blinkBallList.value = [];
  ballMoving.value = false;
  cancelAnimationFrame(animationTimer.value);
}

// 显示目标小球
function showTargetBall() {
  isShowTargetBall.value = !isShowTargetBall.value;
  if (isShowTargetBall.value) {
    const { targetBallBlinkBorderColor } = config.value;
    ballArr.value.forEach((x) => {
      if (x.isTarget) {
        x.fillStyle = targetBallBlinkBorderColor;
      }
    });
  } else {
    const { ballDefaultBgColor } = config.value;
    ballArr.value.forEach((x) => {
      if (x.isTarget) {
        x.fillStyle = ballDefaultBgColor;
      }
    });
  }

  draw();
}

// 处理canvas点击
function handleCanvasClick(event) {
  let isClearClickMarker = false;
  //小球完成移动后点击才有效
  if (!isFinishBallMove.value) return;

  const rect = canvasRef.value.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  //重复点击的小球，清除
  clickMarkerPositionList.value.forEach((ball, index) => {
    const dx = x - ball.x;
    const dy = y - ball.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance <= ball.r) {
      clickMarkerPositionList.value.splice(index, 1);
      isClearClickMarker = true;
      draw();
    }
  });
  if (isClearClickMarker) return;
  //判断可选择小球数
  if (clickMarkerPositionList.value.length >= config.value.targetBallNum) {
    ElMessage({
      message: `可选择小球数为${config.value.targetBallNum}个`,
      type: "warning",
    });
    return;
  }

  clickMarkerPositionList.value.push({
    x,
    y,
    r: config.value.ballRadius,
    bgColor: "rgba(255, 215, 0, 0.6)",
  });
  draw();
  // 判断点击的位置是否目标小球
  ballArr.value.forEach((ball) => {
    if (ball.isTarget) {
      const dx = x - ball.x;
      const dy = y - ball.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance <= ball.r) {
        ElMessage({
          message: `恭喜你选中所追踪的小球`,
          type: "success",
        });
      }
    }
  });
}

// 重置Canvas大小
function resetCanvasSize() {
  canvasRef.value.width = window.innerWidth;
  canvasRef.value.height = window.innerHeight;
}

function clear() {
  ctx.value.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height);
}
</script>

<style lang="scss" scoped>
.ball {
  position: relative;
  width: 100%;
  // height: 100%;
  height: var(--el-container-height);
  overflow: hidden;
  .start-guidance-text,
  .end-guidance-text {
    position: absolute;
    top: 2%;
    left: 25%;
    font-size: 60px;
  }
  button:nth-child(2) {
    position: absolute;
    left: 0px;
    top: 20px;
  }
  button:nth-child(3) {
    position: absolute;
    left: 6%;
    top: 20px;
  }
  button:nth-child(4) {
    position: absolute;
    left: 12%;
  }
  button:nth-child(5) {
    position: absolute;
    left: 18%;
    top: 20px;
  }
  button:nth-child(6) {
    position: absolute;
    left: 26%;
    top: 20px;
  }
}
</style>

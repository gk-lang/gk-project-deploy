<template>
  <div class="canvas-container auto-height-container" id="HSBall">
    <canvas ref="canvasRef"> </canvas>
    <div class="btn-container">
      <el-button type="primary" style="margin-left: 16px" @click="showMoveRangeReact">
        {{ isShowMoveRangeReact ? '显示运动范围窗口' : '隐藏运动范围窗口' }}
      </el-button>
      <el-button type="primary" style="margin-left: 16px" @click="showTargetBall">
        {{ isShowTargetBall ? '混淆目标小球' : '显示目标小球' }}
      </el-button>
      <el-button type="primary" style="margin-left: 16px" @click="resetBallMove">
        重置运动
      </el-button>
      <el-button type="primary" style="margin-left: 16px" @click="startOrStopBallMove">
        {{ ballMoving ? '停止运动' : '开始运动' }}
      </el-button>
      <el-button type="primary" style="margin-left: 16px" @click="openDrawer">
        配置运动参数
      </el-button>
    </div>
    <BallConfigDrawer
      v-model:isShow="isShowDrawer"
      v-model:formData="config"
      @save="resetBallMove"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { ElMessage, ElButton } from 'element-plus'
import BallConfigDrawer from './BallConfigDrawer.vue'
import { useAppStore } from '@/store/modules/app'

const appStore = useAppStore()

const canvasRef = ref()
const ctx = ref({})
const isShowDrawer = ref(false)
const isShowTargetBall = ref(false)
const isShowMoveRangeReact = ref(false)
const ballMoving = ref(false)
const animationTimer = ref('')
const clickMarkerPosition = ref(null)

const config = ref({
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
/**
 * 定义小球大小，颜色
 */
const ballArr = ref([])
const blinkBallList = ref([])

// 把小球均匀的绘制到椭圆边线上
function drawBallOnEllipse({ x, y, a, b }) {
  // 保存当前画布状态
  ctx.value.save()
  // 计算canvas的中心点
  const centerX = canvasRef.value.width / 2
  const centerY = canvasRef.value.height / 2

  if (!x) x = centerX
  if (!y) y = centerY

  // 椭圆中心x,y
  const originX = x
  const originY = y

  const balllength = ballArr.value.length
  for (let i = 0; i < balllength; i++) {
    const ball = ballArr.value[i]
    // 计算每个小球的起始角度
    ball.angle = (i / balllength) * 2 * Math.PI

    // 计算小球中心位置坐标
    ball.x = originX + a * Math.cos(ball.angle)
    ball.y = originY + b * Math.sin(ball.angle)
  }
  draw()
  // 恢复画布状态
  ctx.value.restore()
}

// 让小球随机移动
function moveBall() {
  const { ballMoveRangeWidth, ballMoveRangeHeight } = config.value
  // 计算canvas的中心点
  const centerX = canvasRef.value.width / 2
  const centerY = canvasRef.value.height / 2
  // 计算边界坐标
  const rangeLeftX = centerX - ballMoveRangeWidth / 2
  const rangeRightX = centerX + ballMoveRangeWidth / 2
  const rangeTopY = centerY - ballMoveRangeHeight / 2
  const rangeBottomY = centerY + ballMoveRangeHeight / 2
  ballArr.value.forEach((ball) => {
    ball.x += ball.dx
    ball.y += ball.dy

    // 边界检测
    if (ball.x - ball.r < rangeLeftX || ball.x + ball.r > rangeRightX) {
      ball.dx = -ball.dx

      // 边界溢出的情况
      if (ball.x - ball.r < rangeLeftX) {
        ball.x = rangeLeftX + ball.r
      }
      if (ball.x + ball.r > rangeRightX) {
        ball.x = rangeRightX - ball.r
      }
    }
    if (ball.y - ball.r < rangeTopY || ball.y + ball.r > rangeBottomY) {
      ball.dy = -ball.dy

      // 边界溢出的情况
      if (ball.y - ball.r < rangeTopY) {
        ball.y = rangeTopY + ball.r
      }
      if (ball.y + ball.r > rangeBottomY) {
        ball.y = rangeBottomY - ball.r
      }
    }

    // 碰撞检测
    ballArr.value.forEach((otherBall) => {
      if (ball !== otherBall) {
        const dx = ball.x - otherBall.x
        const dy = ball.y - otherBall.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        if (distance < ball.colliRadius + otherBall.colliRadius) {
          const angle = Math.atan2(dy, dx)
          const totalSpeed =
            Math.sqrt(ball.dx * ball.dx + ball.dy * ball.dy) +
            Math.sqrt(otherBall.dx * otherBall.dx + otherBall.dy * otherBall.dy)
          ball.dx = Math.cos(angle) * totalSpeed * 0.5
          ball.dy = Math.sin(angle) * totalSpeed * 0.5
          otherBall.dx = -Math.cos(angle) * totalSpeed * 0.5
          otherBall.dy = -Math.sin(angle) * totalSpeed * 0.5
        }
      }
    })
  })
}

// 绘制所有图形
function draw() {
  ctx.value.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height)
  // drawEllipse({ x: canvasRef.value.width / 2, y: canvasRef.value.height / 2, a: 200, b: 100, angle: Math.PI / 4 });
  // 绘制小球运动范围框口
  if (isShowMoveRangeReact.value) {
    const { ballMoveRangeWidth, ballMoveRangeHeight } = config.value
    // 计算canvas的中心点
    const centerX = canvasRef.value.width / 2
    const centerY = canvasRef.value.height / 2
    // 计算边界坐标
    const rangeLeftX = centerX - ballMoveRangeWidth / 2
    const rangeTopY = centerY - ballMoveRangeHeight / 2
    ctx.value.lineWidth = 1
    ctx.value.strokeStyle = '#3498db'
    ctx.value.strokeRect(rangeLeftX, rangeTopY, ballMoveRangeWidth, ballMoveRangeHeight)
  }
  // 绘制正常小球
  ballArr.value.forEach((ball) => {
    ctx.value.globalAlpha = ball.opacity
    ctx.value.beginPath()
    ctx.value.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2)
    ctx.value.closePath()

    if (ball.lineWidth) {
      ctx.value.lineWidth = ball.lineWidth || 0
      ctx.value.strokeStyle = ball.strokeStyle || ''
      ctx.value.stroke()
      ctx.value.strokeStyle = ''
    }

    if (ball.fillStyle) {
      ctx.value.fillStyle = ball.fillStyle
      ctx.value.fill()
    }

    ctx.value.globalAlpha = 1 // Reset global alpha
  })
  // 绘制闪烁中的小球
  blinkBallList.value.forEach((ball) => {
    ctx.value.globalAlpha = ball.opacity
    ctx.value.beginPath()
    ctx.value.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2)
    ctx.value.closePath()

    if (ball.lineWidth) {
      ctx.value.lineWidth = ball.lineWidth || 0
      ctx.value.strokeStyle = ball.strokeStyle || ''
      ctx.value.stroke()
      ctx.value.strokeStyle = ''
    }

    if (ball.fillStyle) {
      ctx.value.fillStyle = ball.fillStyle
      ctx.value.fill()
    }

    ctx.value.globalAlpha = 1 // Reset global alpha
  })
  // 绘制点击小圆点
  if (clickMarkerPosition.value) {
    const { x, y, r, bgColor } = clickMarkerPosition.value
    // 绘制标记的点
    ctx.value.beginPath()
    ctx.value.arc(x, y, r, 0, Math.PI * 2)
    ctx.value.fillStyle = bgColor // Color of the dot
    ctx.value.fill()
    ctx.value.closePath()
  }
}

function blinkBall2(callback) {
  const blinkCount = config.value.targetBallBlinkCount
  const blinkDuration = config.value.targetBallBlinkDuration

  const lineMaxWidth = 2 * config.value.ballRadius - 10

  const blinkBallList = ballArr.value.filter((x) => x.isTarget)
  blinkBallList.forEach((x) => {
    x.ballR = config.value.ballRadius
    x.blinkCount = 0
    x.blinkDirection = -1
    x.blinkStep = x.ballR / (blinkDuration / 16)
  })
  function fade() {
    for (let i = 0; i < blinkBallList.length; i++) {
      const ball = blinkBallList[i]
      // 变化边线宽度与小球半径
      ball.lineWidth += ball.blinkDirection * ball.blinkStep
      ball.r = ball.ballR - ball.lineWidth / 2
      if (ball.r < 0) {
        ball.r = 1
      } else if (ball.r > ball.ballR) {
        ball.r = ball.ballR
      }
      // 小球线宽变化方向
      if (ball.lineWidth <= 0) {
        ball.lineWidth = 0
        ball.blinkDirection = 1
      } else if (ball.lineWidth >= lineMaxWidth) {
        ball.lineWidth = lineMaxWidth
        ball.blinkCount++
        ball.blinkDirection = -1
      }

      // 通过小球闪烁次数判断是否完成闪烁
      if (ball.blinkCount <= blinkCount) {
        ball.isFinish = false
      } else {
        ball.isFinish = true
        ball.r = ball.ballR
        ball.lineWidth = 0
        delete ball.ballR
        delete ball.blinkCount
        delete ball.blinkDirection
        delete ball.blinkStep
      }
    }
    draw()

    const isFinish = blinkBallList.every((x) => x.isFinish)
    if (isFinish) {
      callback()
    } else {
      // 刷新视图
      animationTimer.value = requestAnimationFrame(fade)
    }
  }

  fade()
}

// 闪烁指定小球,callback:回调
function blinkBall(callback) {
  //闪烁次数
  const blinkCount = config.value.targetBallBlinkCount
  //闪烁周期
  const blinkDuration = config.value.targetBallBlinkDuration
  //闪烁速度
  const blinkRate = blinkDuration / blinkCount / 2
  let blinkCountIndex = 0
  let isShowBlinkBall = true

  blinkBallList.value = ballArr.value.filter((x) => x.isTarget)

  function changeBlinkBallStatus() {
    setTimeout(() => {
      isShowBlinkBall = !isShowBlinkBall
      blinkCountIndex++
      if (blinkCountIndex < blinkCount * 2) {
        changeBlinkBallStatus()
      } else {
        blinkBallList.value = []
      }
    }, blinkRate)
  }

  function fade() {
    for (let i = 0; i < blinkBallList.value.length; i++) {
      const ball = blinkBallList.value[i]
      if (isShowBlinkBall) {
        ball.strokeStyle = config.value.targetBallBlinkBorderColor
        ball.lineWidth = 15
        ball.r = config.value.ballRadius - ball.lineWidth / 2
      } else {
        ball.strokeStyle = ''
        ball.lineWidth = 0
        ball.r = config.value.ballRadius - ball.lineWidth / 2
      }
    }
    draw()

    if (blinkCount * 2 <= blinkCountIndex) {
      callback()
    } else {
      // 刷新视图
      animationTimer.value = requestAnimationFrame(fade)
    }
  }

  fade()
  changeBlinkBallStatus()
}
// 初始化小球速度
function initializeBalls() {
  ballArr.value = []
  const {
    ballNum,
    targetBallNum,
    ballMoveSpeed,
    ballRadius,
    ballDefaultBgColor,
    viewBGColor,
    ballColliRadius
  } = config.value
  canvasRef.value.style.background = viewBGColor
  // 设置小球相关配置属性
  for (let i = 0; i < ballNum; i++) {
    //生成0-360之间的随机数
    const angle = Math.floor(Math.random() * 361)

    const ballItem = {
      dx: Math.cos(angle) * ballMoveSpeed,
      dy: Math.sin(angle) * ballMoveSpeed,
      r: ballRadius,
      fillStyle: ballDefaultBgColor,
      strokeStyle: '',
      lineWidth: 0,
      colliRadius: ballColliRadius,
      opacity: 1,
      isTarget: false
    }
    ballArr.value.push(ballItem)
  }
  // 随机指定需要追踪的小球
  let targetCount = 0
  while (targetCount < targetBallNum) {
    // 生成 0 到 n-1 之间的整数：
    const index = Math.floor(Math.random() * ballArr.value.length)
    const item = ballArr.value[index]
    if (!item.isTarget) {
      item.isTarget = true
      targetCount++
    }
  }
}

/**
 * 更新canvas实现动画效果
 */
function randomMoveBall() {
  // 移动小球
  moveBall()
  // 绘制小球
  draw()
  // 刷新视图
  animationTimer.value = requestAnimationFrame(randomMoveBall)
}

// 重置小球运动到初始状态
function resetBallMove() {
  ballMoving.value = false
  if (animationTimer.value) {
    cancelAnimationFrame(animationTimer.value)
  }
  // 重置后不显示小球运动范围框
  isShowMoveRangeReact.value = false
  // 重置后不显示目标小球的颜色
  isShowTargetBall.value = false
  // 清空点击标记圆点
  clickMarkerPosition.value = null
  // 清空前一帧元素
  ctx.value.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height)
  // 初始化小球移动速度
  initializeBalls()
  // 绘制小球平均分布到椭圆轨迹上
  drawBallOnEllipse({
    a: config.value.ellipseMajorAxis,
    b: config.value.ellipseMinorAxis
  })
}
// 显示目标小球
function showTargetBall() {
  isShowTargetBall.value = !isShowTargetBall.value
  if (isShowTargetBall.value) {
    const { targetBallBlinkBorderColor } = config.value
    ballArr.value.forEach((x) => {
      if (x.isTarget) {
        x.fillStyle = targetBallBlinkBorderColor
      }
    })
  } else {
    const { ballDefaultBgColor } = config.value
    ballArr.value.forEach((x) => {
      if (x.isTarget) {
        x.fillStyle = ballDefaultBgColor
      }
    })
  }

  draw()
}
// 显示小球运动范围框口
function showMoveRangeReact() {
  isShowMoveRangeReact.value = !isShowMoveRangeReact.value
  draw()
}
function stopBallMove() {
  ballArr.value.forEach((x) => {
    if (x.isTarget) {
      x.r = config.value.ballRadius
    }
  })
  blinkBallList.value = []
  ballMoving.value = false
  cancelAnimationFrame(animationTimer.value)
}
// 开始或停止小球运动
function startOrStopBallMove() {
  ballMoving.value = !ballMoving.value
  if (ballMoving.value) {
    blinkBall(() => {
      // 让小球blinkToMoveSilentTime毫秒后，随机运动
      setTimeout(() => {
        randomMoveBall()
      }, config.value.blinkToMoveSilentTime)
      // 让小球ballMoveDuration毫秒后，停止运动
      setTimeout(() => {
        stopBallMove()
      }, config.value.ballMoveDuration)
    })
  } else {
    stopBallMove()
  }
}

// 重置Canvas大小
function resetCanvasSize() {
  const HSBallWrapEl = document.getElementById('HSBall')
  if(HSBallWrapEl){
    canvasRef.value.width = HSBallWrapEl.offsetWidth - 14
    canvasRef.value.height = HSBallWrapEl.offsetHeight - 14
  }
  draw()
}

// 打开抽屉视图
function openDrawer() {
  isShowDrawer.value = true
}

// 处理canvas点击
function handleCanvasClick(event) {
  const rect = canvasRef.value.getBoundingClientRect()
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top
  clickMarkerPosition.value = { x, y, r: 8, bgColor: '#00f' }
  draw()
  // 判断点击的位置是否目标小球
  ballArr.value.forEach((ball) => {
    if (ball.isTarget) {
      const dx = x - ball.x
      const dy = y - ball.y
      const distance = Math.sqrt(dx * dx + dy * dy)
      if (distance <= ball.r) {
        ElMessage({
          message: `恭喜你选中所追踪的小球`,
          type: 'success'
        })
      }
    }
  })
}

// watch(
//   () => [appStore.getLayout, appStore.getScreenfull, appStore.getCollapse],
//   () => {
//     setTimeout(() => {
//       resetCanvasSize()
//     })
//   }
// )
onMounted(() => {
  const HSBallWrapEl = document.getElementById('HSBall')
  canvasRef.value.width = HSBallWrapEl.offsetWidth - 14
  canvasRef.value.height = HSBallWrapEl.offsetHeight - 14
  // canvasRef.value.style.background = "#ccc";
  ctx.value = canvasRef.value.getContext('2d')
  // 重置小球运动状态
  resetBallMove()
  // 监听canvas的点击事件
  canvasRef.value.addEventListener('click', handleCanvasClick)
  // 使用 ResizeObserver 监控 canvas-container 的尺寸变化
  const resizeObserver = new ResizeObserver(() => {
    resetCanvasSize()
  })
  resizeObserver.observe(HSBallWrapEl)
})
</script>

<style lang="scss">
.canvas-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
  .canvas {
    width: 100%;
    height: 100%;
  }
  .btn-container {
    position: absolute;
    top: 15px;
    right: 15px;
  }
}
</style>

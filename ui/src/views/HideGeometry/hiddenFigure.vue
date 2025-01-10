<template>
  <div class="canvas-hindden-figure ">
    <canvas id="myCanvas" width="17" height="17"></canvas>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from "vue";
// import * as StackBlur from "stackblur-canvas";

onMounted(() => {
  // 获取Canvas元素
  const canvas = document.getElementById("myCanvas");
  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;

  // 绘制左右白色，中间黑色的矩形
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, width / 3, height);
  ctx.fillRect((width / 3) * 2, 0, width / 3, height);
  ctx.fillStyle = "black";
  ctx.fillRect(width / 3, 0, width / 3, height);

  // 获取Canvas上的像素数据
  const imageData = ctx.getImageData(0, 0, width, height);

  // 应用高斯模糊算法
  const radius = 8;
  applyGaussianBlur(imageData, radius);

  // 将处理后的像素数据重新渲染到Canvas上
  ctx.putImageData(imageData, 0, 0);
});

function applyGaussianBlur(imageData, radius) {
  const data = imageData.data;
  const width = imageData.width;
  const height = imageData.height;

  const kernel = generateGaussianKernel(radius);
  const kernelSize = kernel.length;

  const tempData = new Uint8ClampedArray(data.length);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let r = 0,
        g = 0,
        b = 0,
        a = 0;

      for (let i = 0; i < kernelSize; i++) {
        for (let j = 0; j < kernelSize; j++) {
          const k = kernel[i] * kernel[j];
          const offsetX = x + i - Math.floor(kernelSize / 2);
          const offsetY = y + j - Math.floor(kernelSize / 2);

          if (
            offsetX >= 0 &&
            offsetX < width &&
            offsetY >= 0 &&
            offsetY < height
          ) {
            const index = (offsetY * width + offsetX) * 4;
            r += data[index] * k;
            g += data[index + 1] * k;
            b += data[index + 2] * k;
            a += data[index + 3] * k;
          }
        }
      }

      const dataIndex = (y * width + x) * 4;
      tempData[dataIndex] = r;
      tempData[dataIndex + 1] = g;
      tempData[dataIndex + 2] = b;
      tempData[dataIndex + 3] = a;
    }
  }

  for (let i = 0; i < data.length; i++) {
    data[i] = tempData[i];
  }
}

function generateGaussianKernel(radius) {
  const sigma = radius / 3;
  const size = radius * 2 + 1;
  const kernel = new Array(size);
  let sum = 0;

  for (let i = 0; i < size; i++) {
    const x = i - radius;
    kernel[i] =
      Math.exp((-x * x) / (2 * sigma * sigma)) /
      (Math.sqrt(2 * Math.PI) * sigma);
    sum += kernel[i];
  }

  for (let i = 0; i < size; i++) {
    kernel[i] /= sum;
  }

  return kernel;
}
</script>

<style lang="scss" scoped>
.canvas-hindden-figure {
  height: 100%;
  width: 100%;
  overflow: hidden;
  background-color: rgb(127, 127, 127);
  //   canvas {
  //     border: 1px solid black;
  //     filter: blur(10px);
  //   }
}
</style>

import { resolve } from "path";
import { loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import VueJsx from "@vitejs/plugin-vue-jsx";
import progress from "vite-plugin-progress";
import EslintPlugin from "vite-plugin-eslint";
import { viteMockServe } from "vite-plugin-mock";
import { ViteEjsPlugin } from 'vite-plugin-ejs';
import ServerUrlCopy from "vite-plugin-url-copy";
import { visualizer } from 'rollup-plugin-visualizer';

import {
  createStyleImportPlugin,
  ElementPlusResolve,
} from "vite-plugin-style-import";

const root = process.cwd();

function pathResolve(dir) {
  return resolve(root, ".", dir);
}

function loadPlugins(env, isBuild) {
  const plugins = [
    vue({
      script: {
        // 开启defineModel
        defineModel: true,
      },
    }),
    VueJsx(),
    ServerUrlCopy(),
    progress(),
    ViteEjsPlugin({
      title: env.VITE_APP_TITLE
    }),
  ];
  if (env.VITE_USE_ALL_ELEMENT_PLUS_STYLE === "false") {
    plugins.push(
      createStyleImportPlugin({
        resolves: [ElementPlusResolve()],
        libs: [
          {
            libraryName: "element-plus",
            esModule: true,
            resolveStyle: (name) => {
              if (name === "click-outside") {
                return "";
              }
              return `element-plus/es/components/${name.replace(
                /^el-/,
                ""
              )}/style/css`;
            },
          },
        ],
      })
    );
  }
  if (env.VITE_USE_MOCK === "true") {
    plugins.push(
      viteMockServe({
        ignore: /^\_/,
        mockPath: "mock",
        localEnabled: !isBuild,
        prodEnabled: isBuild,
        injectCode: `
    import { setupProdMockServer } from '../mock/_createProductionServer'

    setupProdMockServer()
    `,
      })
    );
  }
  return plugins
}

function getEnvConfig(command,mode) {
  let env = {};
  const isBuild = command === "build";
  if (!isBuild) {
    env = loadEnv(
      process.argv[3] === "--mode" ? process.argv[4] : process.argv[3],
      root
    );
  } else {
    env = loadEnv(mode, root);
  }
  return { env, isBuild };
}

export default ({ command, mode }) => {
  const { env, isBuild } = getEnvConfig(command,mode);
  return {
    plugins: loadPlugins(env, isBuild),
    server: {
      port: 4000,
      proxy: {
        // 选项写法
        "/api": {
          target: "http://127.0.0.1:8000",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
      },
      hmr: {
        overlay: false,
      },
      host: "0.0.0.0",
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use "src/styles/variables.scss" as *;`,
          javascriptEnabled: true
        },
      },
    },
    resolve: {
      extensions: [
        ".mjs",
        ".js",
        ".ts",
        ".jsx",
        ".tsx",
        ".json",
        ".scss",
        ".css",
      ],
      alias: [
        {
          find: /\@\//,
          replacement: `${pathResolve("src")}/`,
        },
      ],
    },
    optimizeDeps: {
      include: [
        "vue",
        "vue-router",
        "element-plus/es/locale/lang/zh-cn",
        "element-plus/es/locale/lang/en",
        "axios",
        "dayjs",
      ],
    },
    esbuild: {
      pure: env.VITE_DROP_CONSOLE === 'true' ? ['console.log'] : undefined,
      drop: env.VITE_DROP_DEBUGGER === 'true' ? ['debugger'] : undefined
    },
    build: {
      target: 'es2015',
      outDir: env.VITE_OUT_DIR || 'dist',
      sourcemap: env.VITE_SOURCEMAP === 'true',
      // brotliSize: false,
      rollupOptions: {
        plugins: env.VITE_USE_BUNDLE_ANALYZER === 'true' ? [visualizer()] : undefined,
        // 拆包
        output: {
          manualChunks: {
            'vue-chunks': ['vue', 'vue-router', 'pinia'],
            'element-plus': ['element-plus'],
          }
        }
      },
      cssCodeSplit: !(env.VITE_USE_CSS_SPLIT === 'false'),
      cssTarget: ['chrome31']
    },
  };
};

const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  publicPath: "./",
  transpileDependencies: true,
  productionSourceMap: false,
  css: {
    loaderOptions: {
      less: {
        lessOptions: {
          // 这里可以设置全局变量等
          modifyVars: {
            // 示例：设置主题色为红色
            "primary-color": "#ff0000",
          },
          javascriptEnabled: true,
        },
      },
    },
  },
});

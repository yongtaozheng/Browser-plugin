<template>
  <div id="appJYChromeTab">
    <el-tabs
      id="appJYChromeTabElTabs"
      type="border-card"
      style="height: 100%;
}"
    >
      <el-tab-pane label="配置管理"><configView></configView></el-tab-pane>
      <el-tab-pane label="浏览器标签记录">浏览器标签记录</el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import configView from "./components/configView.vue";

export default {
  name: "appJYChromeTab",
  components: {
    configView,
  },
};
</script>

<style lang="less" scoped>
#appJYChromeTab {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 10px;
  width: 500px;
  height: 300px;
  #appJYChromeTabElTabs {
    // background: url("./assets/logo.png") no-repeat center center / cover;
  }
}
</style>

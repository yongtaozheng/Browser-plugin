<template>
  <el-tabs type="border-card">
    <el-tab-pane label="浏览器标签记录">浏览器标签记录</el-tab-pane>
    <el-tab-pane label="配置管理">配置管理</el-tab-pane>
  </el-tabs>
</template>

<script>
import { sendMessage } from "../../utils/chrome.js";
export default {
  name: "HelloWorld",
  props: {
    msg: String,
  },
  data() {
    return {
      inputVal: "",
    };
  },
  methods: {
    sendData() {
      sendMessage({ action: "sendData", data: this.inputVal });
    },
  },
};
</script>

<style scoped></style>

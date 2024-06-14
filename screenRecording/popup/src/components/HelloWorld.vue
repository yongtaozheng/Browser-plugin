<template>
  <div class="hello">
    <h2>screenRecording</h2>
    <p>
      🔎源码地址：<a
        target="_blank"
        href="https://gitee.com/zheng_yongtao/chrome-plug-in/tree/master/screenRecording"
        >https://gitee.com/zheng_yongtao/chrome-plug-in/tree/master/screenRecording</a
      >
    </p>
    <p>👨‍💻作者：JYeontu</p>
    <p>💥公众号：前端也能怎么有趣</p>
    <p>🤝🤝🤝感谢使用🤝🤝🤝</p>
    <p>⭐⭐⭐欢迎star⭐⭐⭐</p>
  </div>
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
    startMediaRecorder() {
      sendMessage({ action: "startMediaRecorder" });
    },
  },
};
</script>

<style scoped>
p {
  word-break: break-all;
}
</style>

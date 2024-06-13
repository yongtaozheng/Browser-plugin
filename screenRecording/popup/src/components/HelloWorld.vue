<template>
  <div class="hello">
    <h1 id="message">JYeontu</h1>
    <button id="sendData" @click="startMediaRecorder">开始录屏</button>
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

<style scoped></style>

<template>
  <div id="ChromeImgPreviewApp" v-show="showPanel">
    <div id="ChromeImgPreviewMask" @click="closePanel()"></div>
    <div id="ChromeImgPreview">
      <span id="ChromeImgPreviewClose" @click="closePanel()">×</span>
      <tabBar
        :tabList="tabList"
        v-model="activeTab"
        id="ChromeImgPreviewTabBar"
      ></tabBar>
      <div style="width: 100%; flex: 1; overflow: scroll">
        <iframe
          v-if="activeTab.title === '翻译'"
          title="翻译"
          style="width: 100%; height: 100%"
          src="https://fanyi.qq.com/"
        ></iframe>
        <iframe
          v-else-if="activeTab.title === 'ChatGPT'"
          title="ChatGPT"
          style="width: 100%; height: 100%"
          src="https://chat18.aichatos.xyz/#/chat/1700925030769"
        ></iframe>
      </div>
    </div>
  </div>
</template>

<script>
import tabBar from "./components/common/tabBar.vue";
export default {
  name: "ChromeImgPreviewApp",
  components: {
    tabBar,
  },
  data() {
    return {
      activeTab: {
        title: "翻译",
      },
      tabList: [
        {
          title: "翻译",
        },
        {
          title: "ChatGPT",
        },
        {
          title: "写作模板",
        },
      ],
      showPanel: false,
    };
  },
  mounted() {
    const keydownFn = (event) => {
      if (event.altKey && event.key === "v") {
        this.showPanel = !this.showPanel;
      }
    };
    const ChromeImgPreview = document.getElementById("ChromeImgPreview");
    const ChromeImgPreviewMask = document.getElementById(
      "ChromeImgPreviewMask"
    );
    document.addEventListener("keydown", keydownFn);
    ChromeImgPreview && ChromeImgPreview.addEventListener("keydown", keydownFn);
    ChromeImgPreviewMask &&
      ChromeImgPreviewMask.addEventListener("keydown", keydownFn);
  },
  methods: {
    closePanel() {
      this.showPanel = false;
    },
  },
};
</script>

<style scoped>
#<ChromeImgPreview > Mask {
  position: fixed;
  background: #b6bdc4;
  opacity: 0.2;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}
#<ChromeImgPreview > {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  position: fixed;
  background: #b6bdc4;
  opacity: 0.9;
  width: 90%;
  height: 90%;
  top: 5%;
  left: 5%;
  z-index: 999;
  display: flex;
  flex-direction: column;
}
.logo {
  width: 200px;
}
#<ChromeImgPreview > Close {
  position: absolute;
  right: 0;
  font-size: xx-large;
  cursor: pointer;
  top: 0;
  padding: 0 0.5em;
}
#<ChromeImgPreview > Close:hover {
  background: red;
}
#<ChromeImgPreview > TabBar {
  padding-right: 4em;
}
</style>

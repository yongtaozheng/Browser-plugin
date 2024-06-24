<template>
  <div id="emojiPanelApp" v-show="showPanel">
    <div id="emojiPanelMask" @click="closePanel()"></div>
    <div id="emojiPanel">
      <span id="emojiPanelClose" @click="closePanel()">×</span>
      <tabBar
        :tabList="tabList"
        v-model="activeTab"
        id="emojiPanelTabBar"
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
  name: "emojiPanelApp",
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
    const emojiPanel = document.getElementById("emojiPanel");
    const emojiPanelMask = document.getElementById("emojiPanelMask");
    document.addEventListener("keydown", keydownFn);
    emojiPanel && emojiPanel.addEventListener("keydown", keydownFn);
    emojiPanelMask && emojiPanelMask.addEventListener("keydown", keydownFn);
  },
  methods: {
    closePanel() {
      this.showPanel = false;
    },
  },
};
</script>

<style scoped>
#emojiPanelMask {
  position: fixed;
  background: #b6bdc4;
  opacity: 0.2;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}
#emojiPanel {
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
#emojiPanelClose {
  position: absolute;
  right: 0;
  font-size: xx-large;
  cursor: pointer;
  top: 0;
  padding: 0 0.5em;
}
#emojiPanelClose:hover {
  background: red;
}
#emojiPanelTabBar {
  padding-right: 4em;
}
</style>

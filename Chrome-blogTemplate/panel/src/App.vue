<template>
  <div id="chromePlugPanelApp" v-show="showPanel">
    <div id="chromePlugPanelMask" @click="closePanel()"></div>
    <div id="chromePlugPanel">
      <span id="chromePlugPanelClose" @click="closePanel()">×</span>
      <tabBar
        :tabList="tabList"
        v-model="activeTab"
        id="chromePlugPanelTabBar"
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
        <blogTemplate v-else-if="activeTab.title === '博客模板'">
        </blogTemplate>
      </div>
    </div>
  </div>
</template>

<script>
import tabBar from "./components/common/tabBar.vue";
import blogTemplate from "./components/blogTemplate.vue";
export default {
  name: "chromePlugPanelApp",
  components: {
    tabBar,
    blogTemplate,
  },
  data() {
    return {
      activeTab: {
        title: "博客模板",
      },
      tabList: [
        {
          title: "博客模板",
        },
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
    const chromePlugPanel = document.getElementById("chromePlugPanel");
    const chromePlugPanelMask = document.getElementById("chromePlugPanelMask");
    document.addEventListener("keydown", keydownFn);
    chromePlugPanel && chromePlugPanel.addEventListener("keydown", keydownFn);
    chromePlugPanelMask &&
      chromePlugPanelMask.addEventListener("keydown", keydownFn);
  },
  methods: {
    closePanel() {
      this.showPanel = false;
    },
  },
};
</script>

<style scoped>
#chromePlugPanelMask {
  position: fixed;
  background: #b6bdc4;
  opacity: 0.2;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}
#chromePlugPanel {
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
#chromePlugPanelClose {
  position: absolute;
  right: 0;
  font-size: xx-large;
  cursor: pointer;
  top: 0;
  padding: 0 0.5em;
}
#chromePlugPanelClose:hover {
  background: red;
}
#chromePlugPanelTabBar {
  padding-right: 4em;
}
</style>

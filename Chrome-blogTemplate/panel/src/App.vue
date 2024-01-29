<template>
  <div id="blogTemplateApp" v-show="showPanel">
    <div id="blogTemplateAppMask" @click="closePanel()"></div>
    <div id="blogTemplateApp">
      <span id="blogTemplateAppClose" @click="closePanel()">×</span>
      <tabBar
        :tabList="tabList"
        v-model="activeTab"
        id="blogTemplateAppTabBar"
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
  name: "blogTemplateApp",
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
    const blogTemplateApp = document.getElementById("blogTemplateApp");
    const blogTemplateAppMask = document.getElementById("blogTemplateAppMask");
    document.addEventListener("keydown", keydownFn);
    blogTemplateApp && blogTemplateApp.addEventListener("keydown", keydownFn);
    blogTemplateAppMask &&
      blogTemplateAppMask.addEventListener("keydown", keydownFn);
  },
  methods: {
    closePanel() {
      this.showPanel = false;
    },
  },
};
</script>

<style scoped>
#blogTemplateAppMask {
  position: fixed;
  background: #b6bdc4;
  opacity: 0.2;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}
#blogTemplateApp {
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
#blogTemplateAppClose {
  position: absolute;
  right: 0;
  font-size: xx-large;
  cursor: pointer;
  top: 0;
  padding: 0 0.5em;
}
#blogTemplateAppClose:hover {
  background: red;
}
#blogTemplateAppTabBar {
  padding-right: 4em;
}
</style>

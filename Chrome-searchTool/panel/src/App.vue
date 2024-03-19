<template>
  <div
    id="chromeSearchToolApp"
    v-show="showPanel"
    :style="{ top: dragData.top + 'px', left: dragData.left + 'px' }"
  >
    <input id="chromeSearchInput" v-model="query" />
    <div id="chromeSearchTool">
      <span class="chrome-search-tool-num" v-if="query !== ''"
        >{{ matches.length ? index + 1 : 0 }}/{{ matches.length }}</span
      >
      <span>|</span>
      <span class="chrome-search-tool-btn" @click="changeIndex(-1)">∧</span>
      <span class="chrome-search-tool-btn" @click="changeIndex(1)">∨</span>
      <span class="chrome-search-tool-btn" @click="closePanel">x</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "chromeSearchToolApp",
  components: {},
  data() {
    return {
      showPanel: false,
      index: -1,
      query: "",
      debounceTimer: null,
      debounceTime: 500,
      keydownFnTimer: null,
      matches: [],
      domList: [],
      dragData: {
        isDragging: false,
        top: window.innerHeight * 0.05,
        left: window.innerWidth * 0.6,
        startX: 0,
        startY: 0,
      },
      isComposing: false,
    };
  },
  watch: {
    index(newVal, oldVal) {
      const spans = this.matches;
      const oldSpan = spans[oldVal];
      if (oldSpan) oldSpan.style.backgroundColor = "yellow";
      const newSpan = spans[newVal];
      if (newSpan) newSpan.style.backgroundColor = "orange";
    },
    query(newVal, oldVal) {
      this.inputComplate(newVal);
    },
  },
  mounted() {
    this.initDrag();
    this.init();
  },
  methods: {
    addCustomSearchEventListener(element) {
      if (element.tagName === "INPUT" || element.tagName === "TEXTAREA") {
        return;
      }
      element.addEventListener("keydown", this.keydownFn);
      for (let i = 0; i < element.children.length; i++) {
        this.addCustomSearchEventListener(element.children[i]);
      }
    },
    // 初始化拖拽功能
    initDrag() {
      const chromeSearchToolApp = document.getElementById(
        "chromeSearchToolApp"
      );
      chromeSearchToolApp.addEventListener("mousedown", this.startDrag);
      document.addEventListener("mousemove", this.dragging);
      document.addEventListener("mouseup", this.endDrag);
    },
    startDrag(event) {
      this.dragData.isDragging = true;
      this.dragData.startX = event.clientX - this.dragData.left;
      this.dragData.startY = event.clientY - this.dragData.top;
    },
    dragging(event) {
      if (this.dragData.isDragging) {
        this.dragData.left = event.clientX - this.dragData.startX;
        this.dragData.top = event.clientY - this.dragData.startY;
      }
    },
    endDrag() {
      this.dragData.isDragging = false;
    },
    keydownFnListening(dom = window) {
      dom.addEventListener("keydown", function (e) {
        if (e.altKey && e.key === "g") {
          e.preventDefault();
          if (dom.e && dom.e.returnValue) dom.e.returnValue = false;
          return false;
        }
      });
    },
    ctrlFAction(query = "") {
      this.showPanel = true;
      if (this.showPanel) {
        this.$nextTick(() => {
          setTimeout(() => {
            const chromeSearchInput =
              document.getElementById("chromeSearchInput");
            chromeSearchInput.focus();
            this.performCustomSearch(query);
          }, 100);
        });
      }
    },
    keydownFn(event) {
      if (this.keydownFnTimer) clearTimeout(this.keydownFnTimer);
      this.keydownFnTimer = setTimeout(() => {
        let query = this.getSelectedText();
        if (query === "") {
          query = localStorage.getItem("chromeSearchQueryKeyJY") || "";
        }
        if (event.altKey && event.key === "g") {
          this.query = query;
          event.preventDefault();
          this.ctrlFAction(query);
        }
      }, 200);
    },
    init() {
      this.keydownFnListening();
      this.addCustomSearchEventListener(document);
      const iframes = document.querySelectorAll("iframe");
      for (let i = 0; i < iframes.length; i++) {
        try {
          const iframeDocument = iframes[i].contentDocument;
          this.addCustomSearchEventListener(iframeDocument);
          this.keydownFnListening(iframes[i].contentWindow);
        } catch (e) {
          console.error("Error accessing iframe content:", e);
        }
      }
    },
    inputComplate(query) {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = setTimeout(() => {
        this.query = query;
        this.performCustomSearch(query);
      }, this.debounceTime); // 设置防抖延迟时间
    },
    closePanel() {
      this.showPanel = false;
      this.clearFlag();
    },
    getSelectedText() {
      let selectedText = "";
      if (window.getSelection) {
        selectedText = window.getSelection().toString();
      } else if (document.selection && document.selection.type != "Control") {
        selectedText = document.selection.createRange().text;
      }
      return selectedText;
    },
    getChromeSearchResultItem(doc = document) {
      const domList = document.querySelectorAll(".chromeSearchResultItem");
      let matches = [...domList];
      matches = matches.filter((item) => {
        const rect = item.getBoundingClientRect();
        return rect.height > 0 && rect.width > 0;
      });
      matches.sort((a, b) => {
        const rectA = a.getBoundingClientRect();
        const rectB = b.getBoundingClientRect();
        if (rectA.top === rectB.top) return rectA.left - rectB.left;
        return rectA.top - rectB.top;
      });
      return {
        domList,
        matches,
      };
    },
    performCustomSearch(query) {
      this.clearFlag();
      if (query === "") return;
      localStorage.setItem("chromeSearchQueryKeyJY", query);
      this.searchInNode(document.body, query); // 在主页面中搜索
      const { domList, matches } = this.getChromeSearchResultItem(document);
      this.matches = [...matches];
      this.domList = domList;
      const iframes = document.querySelectorAll("iframe");
      for (let i = 0; i < iframes.length; i++) {
        try {
          const iframeDocument = iframes[i].contentDocument;
          if (iframeDocument.body)
            this.searchInNode(iframeDocument.body, query); // 在每个iframe内部搜索
          const { domList, matches } =
            this.getChromeSearchResultItem(iframeDocument);
          this.matches.push(...matches);
          this.domList.push(...domList);
        } catch (e) {
          console.error("Error accessing iframe content:", e);
        }
      }
      this.index = -1;
      this.showMatch = this.changeIndex(1);
    },
    escapeRegExp(string) {
      return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    },
    searchInNode(node, query) {
      let walker = document.createTreeWalker(
        node,
        NodeFilter.SHOW_TEXT,
        null,
        false
      );
      let regex = query;
      try {
        regex = new RegExp(query, "ig");
        if (regex.test("")) throw new Error("");
      } catch (err) {
        query = this.escapeRegExp(query);
        regex = new RegExp(query, "ig");
      }
      let matches = [];
      while (walker.nextNode()) {
        if (regex.test(walker.currentNode.nodeValue)) {
          matches.push(walker.currentNode);
        }
      }
      if (matches.length > 0) {
        for (const match of matches) {
          const textNode = match;
          const text = textNode.nodeValue.replace(
            new RegExp("(" + query + ")", "ig"),
            '<span class="chromeSearchResultItem" style="background-color: yellow; color: black;">$1</span>'
          );
          if (match.parentNode) match.parentNode.innerHTML = text;
        }
      }
    },
    clearFlag() {
      const spans = this.domList;
      spans.forEach((span) => {
        if (span.parentNode) {
          span.parentNode.innerHTML = span.parentNode.innerHTML.replace(
            /<span class="chromeSearchResultItem" style="background-color: (yellow|orange); color: black;">(.*?)<\/span>/g,
            "$2"
          );
        }
      });
      this.matches = [];
      this.domList = [];
      this.index = -1;
    },
    changeIndex(delta) {
      const newIndex =
        (this.index + delta + this.matches.length) % this.matches.length;
      if (newIndex >= 0 && newIndex < this.matches.length) {
        this.index = newIndex;
        const match = this.matches[this.index];
        if (match && match.getBoundingClientRect) {
          const rect = match.getBoundingClientRect();
          window.scrollTo({
            top: rect.top + window.pageYOffset - window.screen.availHeight / 2,
            behavior: "smooth",
          });
        }
      }
    },
  },
};
</script>

<style scoped>
#chromeSearchToolApp {
  display: flex;
  z-index: 999;
  position: fixed;
  top: 5%;
  right: 10%;
  background: #fff;
  box-shadow: 5px 5px 5px 5px #d7d6d6;
  padding: 0.5em;
  line-height: 2.5em;
  width: 25em;
  cursor: move; /* 鼠标样式为可移动 */
  opacity: 0.8;
  border-radius: 0.5em;
  font-size: medium;
}
#chromeSearchInput {
  line-height: 1.5em;
  outline: none;
  border: none;
  flex: 1;
}
#chromeSearchTool {
  cursor: pointer;
  margin-left: auto;
  user-select: none;
}
.chrome-search-tool-btn {
  margin: 0 0.5em;
  width: 1.5em;
  height: 1.5em;
  font-size: medium;
  display: inline-block;
  background: none;
  line-height: 1.3em;
  text-align: center;
  border-radius: 50%;
  font-weight: bold;
}
.chrome-search-tool-num {
  margin: 0 0.5em;
  font-size: small;
}
.chrome-search-tool-btn:hover {
  color: #da8114;
  background: #e0e0e0;
}
</style>

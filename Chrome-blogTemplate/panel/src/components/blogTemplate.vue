<template>
  <div class="blog-template">
    <!-- <div class="blog-template-header"></div> -->
    <div class="blog-template-contetn">
      <div class="blog-template-content-left">
        <div
          class="blog-template-content-left-item"
          style="background: #ee4866; margin-bottom: 0.5em"
          @click="addArticle"
        >
          新增
        </div>
        <div
          v-for="article in articleList"
          :key="article.name"
          :class="{
            'blog-template-content-left-item': true,
            'blog-template-content-left-item-active':
              article.name == showArticle.name,
          }"
          @click="articleShow(article)"
        >
          {{ article.name }}
        </div>
      </div>
      <div class="blog-template-content-right">
        <input
          class="blog-template-content-right-name"
          v-if="isAdd"
          v-model="showArticle.name"
          placeholder="请输入模板名"
        />
        <div
          contenteditable="true"
          id="blogTemplateContentRightText"
          class="blog-template-content-right-text"
        >
          {{ showArticle.content }}
        </div>
        <button
          v-if="isAdd"
          @click="createFile"
          class="blog-template-content-right-btn"
        >
          发布
        </button>
        <button
          v-else
          @click="deleteFile"
          class="blog-template-content-right-btn blog-template-content-right-btn-del"
        >
          删除
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import {
  fetchFileContent,
  createFileInGitee,
  getDecodedContent,
  deleteFileInGitee,
} from "../utils/gitee";
export default {
  name: "blogTemplate",
  data() {
    return {
      blogDir:
        "https://gitee.com/api/v5/repos/zheng_yongtao/md-blog-store/contents/template",
      articleList: [],
      showArticle: {},
      isAdd: false,
    };
  },
  watch: {
    showArticle(newVal) {
      this.setArticleText();
    },
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    addArticle() {
      this.showArticle = {
        name: "",
        content: "",
      };
      this.isAdd = true;
    },
    articleShow(article) {
      this.showArticle = article;
      this.isAdd = false;
      if (!article.content) {
        this.getFileContent(article);
      }
    },
    setArticleText() {
      const article = this.showArticle || {};
      document.getElementById("blogTemplateContentRightText").innerText =
        article.content || "";
    },
    async getFileContent(article) {
      const file = await fetchFileContent(article.url);
      const fileContent = file.content || "";
      article.content = getDecodedContent(fileContent, false);
      this.showArticle = article || {};
      this.setArticleText();
    },
    async getArticleList() {
      const articleList = await axios.get(this.blogDir);
      this.articleList = articleList.map((item) => {
        return { name: item.name, url: item.url, sha: item.sha };
      });
      if (this.articleList.length === 0) {
        this.isAdd = true;
        return;
      }
      this.getFileContent(this.articleList[0]);
    },
    async createFile() {
      const content = document.getElementById(
        "blogTemplateContentRightText"
      ).innerText;
      if (!this.showArticle.name) {
        alert("请输入模板名");
        return;
      }
      if (!content) {
        alert("请输入模板内容");
        return;
      }
      const res = await createFileInGitee(
        this.blogDir,
        this.showArticle.name,
        content
      );
      if (res) this.fetchData();
    },
    async deleteFile() {
      if (confirm("确定删除该模板？")) {
        const res = await deleteFileInGitee(
          this.blogDir,
          this.showArticle.name,
          this.showArticle.sha
        );
        if (res) this.fetchData();
      } else {
        return;
      }
    },
    async fetchData() {
      this.getArticleList();
    },
  },
};
</script>

<style scoped>
.blog-template {
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
  background: #f1f1f1;
}
.blog-template-header {
  height: 10%;
  border-bottom: solid 1px rgb(225, 222, 222);
  overflow-x: scroll;
}
.blog-template-contetn {
  flex: 1;
  display: flex;
  overflow: hidden;
}
.blog-template-content-left {
  width: 20%;
  border-right: solid 1px rgb(68, 27, 27);
  overflow-y: scroll;
  padding-top: 1em;
}
.blog-template-content-left-item {
  padding: 1em 0;
  border-bottom: 1px solid #4f4848;
  cursor: pointer;
}
.blog-template-content-left-item-active {
  background: skyblue;
}
.blog-template-content-left-item:hover {
  color: orange;
}
.blog-template-content-right {
  width: 80%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.blog-template-content-right-name {
  line-height: 2em;
  margin: 1em auto;
  width: 80%;
  text-align: center;
}
.blog-template-content-right-text {
  flex: 1;
  overflow-y: scroll;
  text-align: left;
  padding: 1em;
  white-space: pre-wrap; /* 允许换行 */
  word-wrap: break-word; /* 强制在单词内换行 */
  border: solid 1px #2b73af;
  margin-left: 5px;
  outline: none;
}
.blog-template-content-right-btn {
  line-height: 2em;
  background: #9abeaf;
  border: none;
  font-size: 20px;
  cursor: pointer;
}
.blog-template-content-right-btn:hover {
  background: #45b787;
}
.blog-template-content-right-btn-del {
  background: #f07c82;
}
.blog-template-content-right-btn-del:hover {
  background: #ee3f4d;
}
/* 修改滚动条的宽度和颜色 */
::-webkit-scrollbar {
  width: 10px; /* 设置滚动条的宽度 */
  height: 10px; /* 设置滚动条的宽度 */
}

/* 设置滚动条的轨道背景颜色 */
::-webkit-scrollbar-track {
  background-color: #f1f1f1;
}

/* 设置滚动条的滑块颜色 */
::-webkit-scrollbar-thumb {
  background-color: #888;
}

/* 设置滚动条的滑块悬停时的颜色 */
::-webkit-scrollbar-thumb:hover {
  background-color: #555;
}
</style>

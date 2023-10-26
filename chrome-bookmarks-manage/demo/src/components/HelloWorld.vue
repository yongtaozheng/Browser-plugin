<template>
  <div class="book-mark-panel">
    <h1>Chrome书签管理</h1>
    <div class="book-mark-panel-input row">
      <input
        id="token"
        v-model="gitInfo.token"
        type="text"
        placeholder="请输入token"
        @change="dataChange"
      />
      <a
        href="https://gitee.com/api/v5/swagger#/getV5ReposOwnerRepoStargazers?ex=no"
        target="_blank"
        >前往获取</a
      >
    </div>
    <div class="book-mark-panel-input row">
      <input
        id="owner"
        v-model="gitInfo.owner"
        type="text"
        placeholder="请输入仓库所属空间地址"
        @change="dataChange"
      />
    </div>
    <div class="book-mark-panel-input row">
      <input
        id="repo"
        v-model="gitInfo.repo"
        type="text"
        placeholder="请输入仓库路径"
        @change="dataChange"
      />
    </div>
    <div class="book-mark-panel-input row">
      <input
        id="filePath"
        v-model="gitInfo.filePath"
        type="text"
        placeholder="请输入书签文件路径"
        @change="dataChange"
      />
    </div>
    <div class="book-mark-panel-btn row">
      <button class="btn" id="saveBookmarks" @click="saveBookmarks(true)">
        覆盖保存
      </button>
      <button class="btn" id="saveBookmarks" @click="saveBookmarks(false)">
        合并保存
      </button>
      <button class="btn" id="getBookmarks" @click="getBookmarks(true)">
        覆盖获取
      </button>
      <button class="btn" id="getBookmarks" @click="getBookmarks(false)">
        合并获取
      </button>
    </div>
    <div class="book-mark-panel-tip">
      <div>覆盖保存：将本地书签覆盖保存到gitee</div>
      <div>合并保存：将本地书签与gitee上的书签数据合并后保存到gitee</div>
      <div>覆盖获取：使用gitee上的书签数据来替换本地的书签数据</div>
      <div>
        合并获取：获取gitee上的书签数据并与本地书签数据合并后替换本地的书签数据
      </div>
    </div>
  </div>
</template>

<script>
import {
  sendMessage,
  getBookmarks,
  mergeBookmarks,
  importBookmarks,
  removeBookmarks,
} from "../utils/chrome";
import { modifyFile, getFile } from "../utils/gitee";
import { IndexedDB } from "../utils/indexDB";

export default {
  name: "HelloWorld",
  data() {
    return {
      gitInfo: {
        token: "",
        owner: "",
        repo: "",
        filePath: "",
      },
      indexedDB: null,
    };
  },
  created() {
    const indexedDB = new IndexedDB("gitInfoDb", "gitInfo");
    this.indexedDB = indexedDB;
    indexedDB
      .createDatabase()
      .then(() => {
        console.log("Database created successfully or already exists");
        return indexedDB.open();
      })
      .then(async () => {
        // 进行其他操作
        const res = (await indexedDB.getById("data")) || this.gitInfo;
        this.gitInfo = res;
      })
      .catch((error) => {
        console.error("Failed to create or open database:", error);
      });
  },
  mounted(){
  },
  methods: {
    dataChange() {
      this.indexedDB.update("data", this.gitInfo);
    },
    sendData() {
      const params = {
        action: "hello",
        data: this.gitInfo.token,
      };
      sendMessage(params);
    },
    async saveBookmarks(isCover) {
      const bookmarkTreeNodes = await getBookmarks();
      modifyFile(this.gitInfo, bookmarkTreeNodes, isCover);
    },
    async getBookmarks(isCover) {
      const res = await getFile(this.gitInfo);
      const bookmarkTreeNodes = await getBookmarks(isCover);
      let newBookmark = res;
      if (!isCover) {
        newBookmark = mergeBookmarks(res, bookmarkTreeNodes);
      }
      removeBookmarks(bookmarkTreeNodes);
      importBookmarks([newBookmark[0].children[0]]);
    },
  },
};
</script>

<style scoped lang="less">
.book-mark-panel {
  width: 500px;
  min-height: 300px;
  background: url("../assets/logo.png") no-repeat center center / cover;
  .row {
    margin: 10px;
    .btn {
      margin: 5px;
    }
  }
  .book-mark-panel-tip {
    color: #056eef;
  }
  .book-mark-panel-input {
  }
}
</style>

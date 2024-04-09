<template>
  <div class="book-mark-panel">
    <div class="book-mark-panel-input row">
      <input
        id="token"
        v-model="gitInfo.token"
        type="text"
        placeholder="token"
        @change="dataChange"
      />
      <div class="">
        <a
          href="https://gitee.com/api/v5/swagger#/getV5ReposOwnerRepoStargazers?ex=no"
          target="_blank"
          >前往获取</a
        >
      </div>
    </div>
    <div class="book-mark-panel-input row">
      <input
        id="owner"
        v-model="gitInfo.owner"
        type="text"
        placeholder="仓库所属空间地址"
        @change="dataChange"
      />
    </div>
    <div class="book-mark-panel-input row">
      <input
        id="repo"
        v-model="gitInfo.repo"
        type="text"
        placeholder="仓库路径"
        @change="dataChange"
      />
    </div>
    <div class="book-mark-panel-input row">
      <input
        id="filePath"
        v-model="gitInfo.filePath"
        type="text"
        placeholder="文件保存目录"
        @change="dataChange"
      />
    </div>
  </div>
</template>

<script>
import { IndexedDB } from "../../utils/indexDB";

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
    const indexedDB = new IndexedDB("gitInfoDb", "chromeTab");
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
  mounted() {},
  methods: {
    dataChange() {
      this.indexedDB.update("data", this.gitInfo);
    },
  },
};
</script>

<style scoped lang="less">
.book-mark-panel {
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

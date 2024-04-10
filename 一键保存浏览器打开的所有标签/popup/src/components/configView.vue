<template>
  <div class="config-view">
    <div
      v-for="(item, index) in gitInfoList"
      :key="item.ename + index"
      class="config-view-row"
    >
      <div class="config-view-row-label">{{ item.name }}</div>
      <input
        id="token"
        v-model="gitInfo[item.ename]"
        type="text"
        :placeholder="item.name"
        @change="dataChange"
      />
      <div>
        <a
          v-if="item.name == 'token'"
          href="https://gitee.com/api/v5/swagger#/getV5ReposOwnerRepoStargazers?ex=no"
          target="_blank"
          >前往获取</a
        >
      </div>
    </div>
  </div>
</template>

<script>
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
      gitInfoList: [
        {
          name: "token",
          ename: "token",
        },
        {
          name: "仓库所属空间地址",
          ename: "owner",
        },
        {
          name: "仓库路径",
          ename: "repo",
        },
        {
          name: "文件保存目录",
          ename: "filePath",
        },
      ],
      indexedDB: null,
    };
  },
  created() {
    this.getStorage();
  },
  mounted() {},
  methods: {
    dataChange() {
      // this.indexedDB.update("data", this.gitInfo);
      localStorage.setItem("gitInfoJY", JSON.stringify(this.gitInfo));
    },
    getStorage() {
      this.gitInfo =
        JSON.parse(localStorage.getItem("gitInfoJY")) || this.gitInfo;
    },
  },
};
</script>

<style scoped lang="less">
.config-view {
  &-row {
    margin-bottom: 10px;
    text-align: center;
    &-label {
      font-weight: bold;
      color: orange;
    }
    input {
      text-align: center;
      line-height: 1.5em;
    }
    .btn {
      margin: 5px;
    }
  }
}
</style>

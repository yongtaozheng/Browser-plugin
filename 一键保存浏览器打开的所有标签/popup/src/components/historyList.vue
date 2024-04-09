<template>
  <div>
    <div @click="saveTabs()">保存</div>
  </div>
</template>

<script>
import { getFile, modifyFile } from "../../utils/gitee";
import { IndexedDB } from "../../utils/indexDB";
import { getChromeTab } from "../../utils/chrome";
import { getToday } from "../../utils/index";
export default {
  name: "historyList",
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
        this.gitInfo.filePath += `/${getToday()}.json`;
        console.log("%c Line:39 🍷 getToday()", "color:#3f7cff", getToday());
        console.log(
          "%c Line:39 🍢 this.gitInfo",
          "color:#465975",
          this.gitInfo
        );
      })
      .catch((error) => {
        console.error("Failed to create or open database:", error);
      });
  },
  methods: {
    async getTodayFile() {
      const res = await getFile(this.gitInfo);
      return res || {};
    },
    async saveTabs() {
      const tabs = await getChromeTab();
      const fileContent = await this.getTodayFile();
      const dateTime = getToday("yyyy-mm-dd~hh:MM:ss");
      fileContent[dateTime] = tabs;
      modifyFile(this.gitInfo, fileContent, true);
    },
    async getTabs() {
      return await getChromeTab();
    },
  },
};
</script>

<style lang="less" scoped></style>

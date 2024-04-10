<template>
  <div style="display: flex; flex-direction: column; height: 100%">
    <el-collapse style="flex: 1" v-model="activeName" accordion>
      <el-collapse-item
        v-for="historyItem in historyDirList"
        :key="historyItem.name"
        :title="historyItem.name"
        :name="historyItem.name"
      >
        <el-collapse v-model="activeName1" accordion style="text-indent: 2em">
          <el-collapse-item
            v-for="listItem in historyItem.list"
            :key="listItem.name"
            :title="listItem.name"
            :name="listItem.name"
          >
            <template slot="title">
              {{ listItem.name
              }}<i
                style="margin-left: 1em"
                class="header-icon el-icon-monitor"
                @click="openUrls(listItem.value)"
              ></i>
            </template>
            <div
              class="list-item-div"
              v-for="item in listItem.value"
              :key="item.id"
              @click="urlClick(item)"
              :title="item.title"
            >
              {{ item.title }}
            </div>
          </el-collapse-item>
        </el-collapse>
      </el-collapse-item>
    </el-collapse>
    <div @click="saveTabs()" style="cursor: pointer">保存</div>
  </div>
</template>

<script>
import { getFile, modifyFile, getGiteeList } from "../../utils/gitee";
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
      historyDirList: [],
      indexedDB: null,
      activeName: "",
      activeName1: "",
    };
  },
  created() {
    this.getStorage();
  },
  watch: {
    activeName(val) {
      if (!val) return;
      this.handleChange(val);
    },
  },
  methods: {
    getStorage() {
      this.gitInfo =
        JSON.parse(localStorage.getItem("gitInfoJY")) || this.gitInfo;
      this.gitInfo.dirPath = this.gitInfo.filePath;
      this.gitInfo.filePath = this.gitInfo.dirPath + `/${getToday()}.json`;
      this.initHistoryDirList();
    },
    async initHistoryDirList() {
      let list = await getGiteeList(this.gitInfo);
      list = list.filter((item) => item.includes(".json")) || [];
      list = list.sort((a, b) => {
        const t1 = new Date(a.split(".")[0]).getTime();
        const t2 = new Date(b.split(".")[0]).getTime();
        return t2 - t1;
      });
      this.historyDirList = list.map((item) => {
        return {
          name: item,
          list: [],
        };
      });
    },
    async getTodayFile() {
      const res = await getFile(this.gitInfo);
      return res || {};
    },
    async handleChange(val) {
      const historyItem =
        this.historyDirList.find((item) => item.name === val) || {};
      if (historyItem.list.length === 0) {
        const gitInfo = { ...this.gitInfo };
        gitInfo.filePath = gitInfo.dirPath + `/${historyItem.name}`;
        const res = await getFile(gitInfo);
        for (const k in res) {
          if (res[k])
            historyItem.list.push({
              name: k,
              value: res[k],
            });
        }
        historyItem.list = historyItem.list.sort((a, b) => {
          const t1 = new Date(a.name.replace("~", " ")).getTime();
          const t2 = new Date(b.name.replace("~", " ")).getTime();
          return t2 - t1;
        });
      }
    },
    urlClick(item) {
      chrome.tabs.create({ url: item.url });
    },
    openUrls(list) {
      // 定义要打开的URL数组
      const urls = list.map((item) => item.url);
      // 创建一个新窗口
      chrome.windows.create({ url: urls, type: "normal" });
    },
    async saveTabs() {
      const tabs = await getChromeTab();
      const fileContent = await this.getTodayFile();
      const dateTime = getToday("yyyy-mm-dd~hh:MM:ss");
      fileContent[dateTime] = tabs;
      await modifyFile(this.gitInfo, fileContent, true);
      this.initHistoryDirList();
    },
  },
};
</script>

<style lang="less" scoped>
.list-item-div {
  text-align: left;
  color: blue;
  text-decoration: underline;
  cursor: pointer;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>

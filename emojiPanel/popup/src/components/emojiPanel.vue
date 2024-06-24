<template>
  <div style="width: 600px">
    <el-tabs tab-position="left" style="height: 400px; width: 600px">
      <el-tab-pane :label="tab.title" v-for="tab in emojiJson" :key="tab.title">
        <h3>{{ tab.title }}</h3>
        <div class="emoji-list">
          <div
            class="emoji-list-item"
            v-for="emoji in tab.list"
            :key="tab.title + emoji.name"
            @click="copyToClipboard(emoji.font)"
          >
            <div class="emoji-list-item-font">
              {{ emoji.font }}
            </div>
            <div class="emoji-list-item-name" :title="emoji.name">
              {{ emoji.name }}
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
    <div class="explain-content">
      <div>点击emoji即可复制到剪切板</div>
      <div>📨公众号：<span style="color: orange">前端也能这么有趣</span></div>
      <div>
        数据来源：<a href="https://www.emojiall.com/zh-hans/all-emojis"
          >https://www.emojiall.com/zh-hans/all-emojis</a
        >
      </div>
      <div>
        插件源码：<a href="https://www.emojiall.com/zh-hans/all-emojis"
          >https://www.emojiall.com/zh-hans/all-emojis</a
        >
      </div>
    </div>
  </div>
</template>

<script>
const emojiJson = require("../config/emoji.json");
export default {
  name: "emojiPanel",
  props: {
    msg: String,
  },
  data() {
    return {
      emojiJson: emojiJson,
    };
  },
  methods: {
    copyToClipboard(value) {
      navigator.clipboard
        .writeText(value)
        .then(() => {
          this.$message({
            message: "已复制到剪切板",
            type: "success",
          });
        })
        .catch((err) => {
          this.$message.error("复制失败：", err);
        });
    },
  },
};
</script>
<style>
.el-tabs__content {
  overflow: scroll !important;
  overflow-x: hidden !important;
  background: #edf2f6;
  height: 100%;
}
.el-tabs--left .el-tabs__nav-wrap.is-left.is-scrollable {
  width: 120px;
  height: 100%;
  overflow: hidden; /* 隐藏溢出的内容 */
  white-space: nowrap; /* 保持文本在一行显示 */
  text-overflow: ellipsis; /* 文本溢出显示省略号 */
}
.el-tabs--left .el-tabs__nav-wrap.is-left > .el-tabs__nav-prev {
  left: 0 !important;
  color: skyblue;
  font-weight: 800;
  font-size: 22px;
}
.el-tabs--left .el-tabs__nav-wrap.is-left > .el-tabs__nav-next {
  right: 0 !important;
  bottom: -10px !important;
  background: #fff !important;
  color: skyblue;
  font-weight: 800;
  font-size: 22px;
  z-index: 9999;
}
.el-tabs__nav-scroll {
  overflow-x: hidden;
  overflow-y: scroll !important;
  height: 400px !important;
}
/* 隐藏滚动条样式 */
::-webkit-scrollbar {
  width: 0; /* 滚动条宽度设置为0 */
  height: 0;
}

/* 隐藏滚动条轨道 */
::-webkit-scrollbar-track {
  background: transparent; /* 轨道背景设置为透明 */
}

/* 隐藏滚动条滑块 */
::-webkit-scrollbar-thumb {
  background: transparent; /* 滑块背景设置为透明 */
}
</style>
<style scoped>
.explain-content {
  padding-top: 10px;
  font-size: 16px;
}
.emoji-list {
  max-width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
}
.emoji-list-item {
  width: 74px;
  margin: 5px;
  background: #fff;
  padding: 0 5px;
  cursor: pointer;
}
.emoji-list-item-font {
  font-size: 30px;
}
.emoji-list-item-name {
  font-size: 14px;
  overflow: hidden; /* 隐藏溢出的内容 */
  white-space: nowrap; /* 保持文本在一行显示 */
  text-overflow: ellipsis; /* 文本溢出显示省略号 */
}
</style>

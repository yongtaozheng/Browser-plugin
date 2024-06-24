## 说在前面

> 💻 在数字时代，`emoji表情符号`已成为很多人沟通的重要工具，但是输入法中的 emoji 表情包可能不太够用，所以很多时候我会到在线的网站去复制 emoji，然后再回来粘贴，这样操作感觉有点繁琐，所以制作了这么一个插件。
>
> 🍃`emojiPanel` 插件，专为提升你的在线聊天体验而设计，让你能够快速、方便地找到你想要的`emoji`表情，增加文字趣味性。

![](https://files.mdnice.com/user/42027/281ac0ba-f89f-434b-bc04-560794b2f724.png)

## 插件开发

### 1、获取 emoji 表情文件

这里推荐一个网站，可以快速查找需要的 emoji，还支持自制 emoji 表情,平时我也会到这里查找自己需要的 emoji 表情。

[https://www.emojiall.com/zh-hans/all-emojis](https://www.emojiall.com/zh-hans/all-emojis)

![](https://files.mdnice.com/user/42027/327fec2a-2865-4b08-a31c-0b42205489ef.png)

![](https://files.mdnice.com/user/42027/443eb4e1-667f-4028-9776-08f1c806dbe7.png)

emoji 表情数据我们便可以从这个网站中获取，简单写个脚本获取页面上的 emoji 表情包

```javascript
const d = document.querySelectorAll(
  "body > div.body_warp.row.no-gutters >section > div > div > div > div > div > div > div > section > div > div > div >div.container-fluid.emoji_list_box > section.emoji_card_list.bg_none.box_wrap"
);
const jsonList = [];
for (let i = 0; i < d.length; i++) {
  const title = d[i]
    .querySelector("h2")
    .innerText.split("\n")[0]
    .replace("表情符号复制", "");
  const emojiList = d[i].querySelectorAll("ul > li");
  const list = [];
  for (let j = 0; j < emojiList.length; j++) {
    const font = emojiList[j].querySelector(".emoji_font").innerText;
    const name = emojiList[j].querySelector(".emoji_name").innerText;
    list.push({
      name,
      font,
    });
  }
  jsonList.push({
    title,
    list,
  });
}
```

![](https://files.mdnice.com/user/42027/504ef41f-9ac3-4a6e-8be5-0098279fa082.png)

### 2、快速生成一个插件框架

可以通过脚手架快速生成一个插件基本框架。

#### 安装`jyeontu`脚手架

```shell
npm install jyeontu
```

#### 使用脚手架快速创建新项目

```shell
jyeontu create
```

选择 `Chrome 插件模板` ，根据提示填写信息即可

#### 初始化

```shell
npm run init
```

#### 打包

```shell
npm run build
```

### 3、插件开发

直接在 popup 目录里编写即可。

```html
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
            <div class="emoji-list-item-font">{{ emoji.font }}</div>
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
        数据来源：<a
          href="https://www.emojiall.com/zh-hans/all-emojis"
          @click="openUrl('https://www.emojiall.com/zh-hans/all-emojis')"
          >https://www.emojiall.com/zh-hans/all-emojis</a
        >
      </div>
      <div>
        插件源码：<a
          href="https://gitee.com/zheng_yongtao/chrome-plug-in/tree/master/emojiPanel"
          @click="
            openUrl(
              'https://gitee.com/zheng_yongtao/chrome-plug-in/tree/master/emojiPanel'
            )
          "
          >https://gitee.com/zheng_yongtao/chrome-plug-in/tree/master/emojiPanel</a
        >
      </div>
    </div>
  </div>
</template>
```

- 复制到剪切板

```javascript
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
}
```

使用浏览器的剪贴板 API 将传入的文本（value）复制到用户的剪贴板中。如果复制成功，会显示一条成功的消息提示；如果复制失败，则会捕获错误并显示错误消息提示用户。

- 打开新标签页

```javascript
openUrl(url) {
  chrome.windows.create(
    {
      url: [url],
      type: "normal",
      width: screen.availWidth, // 设置窗口宽度为屏幕可用宽度
      height: screen.availHeight, // 设置窗口高度为屏幕可用高度
      left: 0, // 窗口左上角的屏幕坐标，通常设置为0
      top: 0, // 窗口左上角的屏幕坐标，通常设置为0
    }
  );
}
```

使用 Chrome 的 chrome.windows.create API 创建一个新窗口，并将传入的 URL 地址加载到这个窗口中。新窗口的尺寸被设置为屏幕的可用宽度和高度，以最大化窗口，同时窗口的位置被设置在屏幕的左上角。

## 插件使用

### 下载

下载地址：[https://gitee.com/zheng_yongtao/chrome-plug-in/blob/master/emojiPanel/emojiPanel.zip](https://gitee.com/zheng_yongtao/chrome-plug-in/blob/master/emojiPanel/emojiPanel.zip)

![](https://files.mdnice.com/user/42027/12d86a2d-1a02-4ed5-91b3-7ea53ace9254.png)

### 安装

下载解压后导入 chrome：[chrome://extensions/](chrome://extensions/)

![](https://files.mdnice.com/user/42027/f2c0965a-38f4-4b0d-8231-756e3f4378c2.png)

选择解压后的文件夹即可

![](https://files.mdnice.com/user/42027/3a31d3f5-e660-4d80-87a3-e65420126a6d.png)

### 设置快捷键

![](https://files.mdnice.com/user/42027/333de3e0-d595-4275-96c6-5916e3ab8077.png)

![](https://files.mdnice.com/user/42027/b78ea90c-9ab2-4e23-8246-75c0bb2714c5.png)

设置完快捷键后即可通过快捷键快速唤起 emoji 面板

![](https://files.mdnice.com/user/42027/a8f1520e-a096-42a7-8cec-f8ae0448111d.png)

## 后续计划

目前只是在编写网页编写文章的时候有查找 emoji 表情的需求，所以优先做了一个`chrome插件`来使用，后续再考虑进行扩展。

- **封装一个 vue 组件**
- **封装一个桌面版**

## 源码

🔎 源码地址：[https://gitee.com/zheng_yongtao/chrome-plug-in/tree/master/emojiPanel](https://gitee.com/zheng_yongtao/chrome-plug-in/tree/master/emojiPanel)

⭐⭐⭐ 欢迎 star⭐⭐⭐

## 公众号

关注公众号『`前端也能这么有趣`』，获取更多有趣内容。

## 说在后面

> 🎉 这里是 JYeontu，现在是一名前端工程师，有空会刷刷算法题，平时喜欢打羽毛球 🏸 ，平时也喜欢写些东西，既为自己记录 📋，也希望可以对大家有那么一丢丢的帮助，写的不好望多多谅解 🙇，写错的地方望指出，定会认真改进 😊，偶尔也会在自己的公众号『`前端也能这么有趣`』发一些比较有趣的文章，有兴趣的也可以关注下。在此谢谢大家的支持，我们下文再见 🙌。

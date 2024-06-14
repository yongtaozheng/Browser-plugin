## 说在前面

> 🎈 不知道大家平时都是使用什么录屏软件呢？有没有想过只用 JavaScript 我们也可以快速实现一个录屏插件？

## 准备工作

开始写代码前我们需要先了解一下以下几点：

### 1、getDisplayMedia

`navigator.mediaDevices.getDisplayMedia()` 是一种基于 Web 的 API，它允许网站在获得用户同意的情况下，捕获用户的屏幕或屏幕的特定部分作为媒体流。这个 API 是[Media Capture and Streams API](https://developer.mozilla.org/en-US/docs/Web/API/Media_Streams_API)的一部分，通常用于实现屏幕共享功能，例如远程协作、视频会议或直播。

#### 基本用法

`getDisplayMedia()` 方法返回一个 Promise，该 Promise 解析为一个`MediaStream`对象，其中包含屏幕捕获的数据。使用此方法的基本步骤如下：

- 1. 调用 `getDisplayMedia()` 并传入配置对象，指定所需的媒体类型和可选的约束条件。
- 2. 处理 Promise 解析后的`MediaStream`对象，例如将其用作`MediaRecorder`的源或显示在`<video>`元素中。

```javascript
if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
  const displayMediaOptions = {
    video: {
      cursor: "always", // 捕获鼠标指针
    },
    audio: false, // 不捕获音频
  };

  navigator.mediaDevices
    .getDisplayMedia(displayMediaOptions)
    .then((stream) => {
      // 屏幕捕获成功，'stream' 包含屏幕的媒体流
    })
    .catch((error) => {
      // 捕获屏幕失败
      console.error("Error: ", error);
    });
}
```

#### 重要特性

- **用户授权**：出于安全和隐私的考虑，浏览器要求用户明确授权才能进行屏幕捕获。
- **异步操作**：`getDisplayMedia()` 是异步的，返回一个 Promise 对象。
- **媒体类型**：可以捕获视频和/或音频，具体取决于`getDisplayMedia()`调用中的配置选项。
- **浏览器兼容性**：不同的浏览器可能有不同的实现和支持程度，需要检查`navigator.mediaDevices.getDisplayMedia`是否存在。

#### 安全和隐私

- 屏幕捕获是一个敏感操作，因为它可能涉及到捕获用户的敏感信息。因此，浏览器会要求用户明确授权。
- 网站在使用`getDisplayMedia()`时应该明确告知用户，并在获得用户同意后进行。

#### 应用场景

- **视频会议**：用户可以共享他们的屏幕或应用程序窗口，以便在远程会议中展示内容。
- **直播**：游戏直播者可以共享他们的游戏画面。
- **远程支持**：技术支持人员可以请求访问用户的屏幕来帮助解决问题。

`getDisplayMedia()` 提供了一种强大的方式，允许 Web 应用以用户控制的方式捕获和使用屏幕内容。

### 2、快速开发一个插件

可以通过脚手架快速生成一个插件基本框架。

#### 安装`jyeontu`脚手架

```shell
npm install jyeontu
```

#### 使用脚手架快速创建新项目

```shell
jyeontu create
```

选择 `Chrome 插件模板` 即可

#### 初始化

```shell
npm run init
```

#### 打包

```shell
npm run build
```

## 插件开发

### 目标

- 1、在浏览器中页面右键菜单加上**开始录屏**按钮

![](https://files.mdnice.com/user/42027/e767f8cf-96f4-4a9a-9c10-27cebeb7f3c3.png)

- 2、点击**开始录屏**按钮后弹出新页面选择录取的屏幕

![](https://files.mdnice.com/user/42027/537743aa-f74b-402b-89d6-ea922384107d.png)

- 3、结束录屏后输出视频文件

![](https://files.mdnice.com/user/42027/647e09b6-bcb1-4488-b4f2-17d9d55e3f1b.png)

### 功能实现

#### 1、浏览器右键菜单添加按钮

```javascript
const id = "screenRecording"; //generateRandomString(8);
chrome.contextMenus.create({
  title: "开始录屏", //菜单的名称
  id: id, //一级菜单的id
  contexts: ["page"], // page表示页面右键就会有这个菜单，如果想要当选中文字时才会出现此右键菜单，用：selection
});
```

![](https://files.mdnice.com/user/42027/e767f8cf-96f4-4a9a-9c10-27cebeb7f3c3.png)

#### 2、监听右键菜单点击事件

这里直接借用百度首页做个中间页面来触发录屏事件 😀😀😀

```javascript
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId == id) {
    var createData = {
      url: "https://baidu.com?isStartMediaRecorder=1",
      // url: chrome.runtime.getURL("recorder.html"),
      type: "normal",
      top: 200,
      left: 300,
      width: 1300,
      height: 800,
    };
    // 创建（打开）一个新的浏览器窗口，可以提供大小、位置或默认 URL 等可选参数
    chrome.windows.create(createData);
  }
});
```

#### 3、判断是否录屏弹窗

直接判断路径参数**isStartMediaRecorder**即可

```javascript
localStorage.setItem("isMediaRecorderEnd", false);
const url = new URL(location.href);
const isStartMediaRecorder = url.searchParams.get("isStartMediaRecorder");
if (isStartMediaRecorder) {
  document.body.style.display = "flex";
  document.body.innerHTML = `<div
    style="
      font-size: large;
      margin: auto;
      font-weight: bold;
      text-align: center;
    "
  >
    录制中
  </div>`;
  startMediaRecorder();
}
```

#### 4、开始录屏

```javascript
function startRecorder(stream) {
  var mime = MediaRecorder.isTypeSupported("video/webm; codecs=vp9")
    ? "video/webm; codecs=vp9"
    : "video/webm";
  var mediaRecorder = new MediaRecorder(stream, { mimeType: mime }); // 录制

  var chunks = [];
  mediaRecorder.addEventListener("dataavailable", function (e) {
    chunks.push(e.data);
  });

  // 监听用户取消屏幕共享
  stream.getTracks().forEach((track) => {
    track.addEventListener("ended", function (e) {
      console.log("轨道结束: ", e);
      // 用户取消屏幕共享，执行清理操作
      mediaRecorder.stop(); // 停止录制
    });
  });

  mediaRecorder.start(); // 手动启动录制
}
function startMediaRecorder() {
  navigator.mediaDevices
    .getDisplayMedia({
      video: true,
    })
    .then((stream) => {
      startRecorder(stream);
    })
    .catch((err) => {
      console.warn(err);
      localStorage.setItem("isMediaRecorderEnd", true);
    });
}
```

#### 5、录屏结束

监听录屏结束事件，并使用**a**标签将录制视频下载到本地。

```javascript
function getFormattedCurrentTime() {
  const now = new Date(); // 获取当前时间
  const year = now.getFullYear(); // 年份
  const month = (now.getMonth() + 1).toString().padStart(2, "0"); // 月份，加1因为月份是从0开始的
  const day = now.getDate().toString().padStart(2, "0"); // 日期
  const hours = now.getHours().toString().padStart(2, "0"); // 小时
  const minutes = now.getMinutes().toString().padStart(2, "0"); // 分钟
  const seconds = now.getSeconds().toString().padStart(2, "0"); // 秒
  return `${year}${month}${day}${hours}${minutes}${seconds}`;
}

mediaRecorder.addEventListener("stop", function () {
  var blob = new Blob(chunks, { type: "video/webm" }); // 确保Blob的MIME类型正确
  var url = URL.createObjectURL(blob);
  var a = document.createElement("a");
  a.href = url;
  a.download = getFormattedCurrentTime() + "-video.webm";
  a.click();
  setTimeout(() => {
    localStorage.setItem("isMediaRecorderEnd", true);
  }, 200);
});
```

## 插件使用

### 下载

下载地址：[https://gitee.com/zheng_yongtao/chrome-plug-in/blob/master/screenRecording/screenRecording.zip](https://gitee.com/zheng_yongtao/chrome-plug-in/blob/master/screenRecording/screenRecording.zip)

![](https://files.mdnice.com/user/42027/c1ef6c8d-35b7-4af6-a6e2-a7e1f89adfc5.png)

### 安装

下载解压后导入 chrome：[chrome://extensions/](chrome://extensions/)

![](https://files.mdnice.com/user/42027/f2c0965a-38f4-4b0d-8231-756e3f4378c2.png)

选择解压后的文件夹即可

![](https://files.mdnice.com/user/42027/783ba21e-86fb-46a1-b078-8032cfba18ea.png)

## 源码

🔎 源码地址：[https://gitee.com/zheng_yongtao/chrome-plug-in/tree/master/screenRecording](https://gitee.com/zheng_yongtao/chrome-plug-in/tree/master/screenRecording)

⭐⭐⭐ 欢迎 star⭐⭐⭐

## 公众号

关注公众号『`前端也能这么有趣`』，获取更多有趣内容。

## 说在后面

> 🎉 这里是 JYeontu，现在是一名前端工程师，有空会刷刷算法题，平时喜欢打羽毛球 🏸 ，平时也喜欢写些东西，既为自己记录 📋，也希望可以对大家有那么一丢丢的帮助，写的不好望多多谅解 🙇，写错的地方望指出，定会认真改进 😊，偶尔也会在自己的公众号『`前端也能这么有趣`』发一些比较有趣的文章，有兴趣的也可以关注下。在此谢谢大家的支持，我们下文再见 🙌。

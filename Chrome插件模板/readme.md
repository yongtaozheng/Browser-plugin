## 说在前面
>在我日常开发以及娱乐生活中，浏览器是我使用频率较高的一个应用，当我大学拥有第一部电脑开始，之后不论电脑换成什么，以及使用的是什么系统，我的首选浏览器都是Chrome，不仅仅是因为其速度快，更多是它丰富的扩展在吸引我，那么大家有没有想过如何自己来开发一个Chrome浏览器插件呢？是不是有的同学会觉得Chrome浏览器插件的制作难度会很大呢？今天就让我来带你们看看一个简单的Chrome浏览器插件的编写过程，并给大家制作一个简单的插件模板，大家可以通过模板来进行快速开发。
## 一、项目结构

一个完整的插件目录结构如下：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/110e67037de8465aa4b9962a07e5d2fd~tplv-k3u1fbpfcp-zoom-1.image)
### （一）html + js

#### 1、manifest.json

简单配置，具体配置说明已在配置项后标出。

```
{
  "manifest_version": 2, //版本号，由google指定为2
  "name": "helloWorld", //插件名称
  "version": "1.0", //插件版本
  "description": "hello world 插件", //插件描述
  "icons": {
    //插件图标
    "128": "img/logo.jpg",
    "48": "img/logo.jpg",
    "16": "img/logo.jpg"
  },
  "browser_action": {
    "default_icon": "img/logo.jpg", //插件图标
    "default_popup": "default_popup" //点击图标后弹出的html互动文件
  },
  "content_scripts": [
    {
      "matches": ["<all_urls>"], //匹配url
      "js": ["bg.js"], //执行脚本
      "run_at": "document_start" //脚本运行时机
    }
  ],
  "permissions": ["tabs", "activeTab"] //权限申请
}
```
使用"content_scripts"你可以修改你当前访问的页面的dom，主要是靠js实现的，里面的"matches"是一个数组，里面装的是一些匹配的规则，意思就是当你的页面的地址满足数组里面的值的时候就会操作js文件，all_urls表示所有网页都会加载脚本。而"js"里面的是具体的操作，具体操作就是要自己写了。
#### 2、popup.html

插件弹窗页，可以直接编写一个html页面，在manifest.json中的default_popup项进行配置即可。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bb8a6d26405f4dc3a555d4a9bf0b4646~tplv-k3u1fbpfcp-zoom-1.image)

```
<!DOCTYPE html>
<html lang="">
  <head>
    <title>helloWorld</title>
    <meta charset="utf-8" />
  </head>
  <body style="width: 200px; height: 200px">
    <h1 id="message">你好</h1>
    <input id="input1" type="text" />
  </body>
  <script src="js/popup.js"></script>
</html>
```

#### 3、popup.js

插件弹窗页的脚本js代码，在popup.html页面中引入即可。

```
(function () {
  const input1 = document.getElementById("input1");
  const message = document.getElementById("message");
  input1.addEventListener("keyup", (e) => {
    message.innerHTML = "你好" + e.target.value;
    chrome.tabs.query({ active: true, currentWindow: true }, function (tab) {
      chrome.tabs.sendMessage(
        tab[0].id,
        {
          action: "hello",
          data: message.innerHTML,
        },
        function (response) {
          console.loig("收到回复：", response.state);
        }
      );
    });
  });
})();
```

#### 4、bg.js

运行在浏览器打开tab窗体的脚本，需要在manifest.json中的content_scripts中进行配置。

```
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  const { action, data } = request;
  console.log("%c Line:4 🥔 action,data", "color:#b03734", action, data);
  sendResponse({ state: "已接收到数据" + data });
});
```
### （二）vue + js
#### 1、使用vue来编写插件弹窗页
![1676816205721.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/09535c810f664418917caffcc1ef1bfb~tplv-k3u1fbpfcp-watermark.image?)

使用vue来编写插件弹窗页面，我们可以将项目结构简化成这样，只需要修改manifest.json中的default_popup为vue项目打出的dist包即可。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7e34a17c376f4a758bb53930876c29df~tplv-k3u1fbpfcp-zoom-1.image)

```
{
  "manifest_version": 2, //版本号，由google指定为2
  "name": "helloWorld", //插件名称
  "version": "1.0", //插件版本
  "description": "hello world 插件", //插件描述
  "icons": {
    //插件图标
    "128": "img/logo.jpg",
    "48": "img/logo.jpg",
    "16": "img/logo.jpg"
  },
  "browser_action": {
    "default_icon": "img/logo.jpg", //插件图标
    "default_popup": "demo/dist/index.html" //点击图标后弹出的html互动文件
  },
  "content_scripts": [
    {
      "matches": ["<all_urls>"], //匹配url
      "js": ["bg.js"], //执行脚本
      "run_at": "document_start" //脚本运行时机
    }
  ],
  "permissions": ["tabs", "activeTab"] //权限申请
}
```

并将popup.js文件移到vue项目中，在index.html中引入即可。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9db651aa8b2547b48bfc83f443fe3e8f~tplv-k3u1fbpfcp-zoom-1.image)

![1676821818851.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ab8586e870984aedb500e9cd83c22849~tplv-k3u1fbpfcp-watermark.image?)
## 二、浏览器导入插件
### （一）进入chrome扩展程序管理页
![1676816452670.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/543b94e36e2b424695ff4524b26e38b2~tplv-k3u1fbpfcp-watermark.image?)

![1676816528511.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4df3be8f22f14053bc4bef204ca9670e~tplv-k3u1fbpfcp-watermark.image?)
### （二）加载扩展程序

![1676816613593.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e87d369c02bd417f8eef546ce7c79a72~tplv-k3u1fbpfcp-watermark.image?)

![1676819409171.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a74e6db39c264f2dbca376d86a93d6c6~tplv-k3u1fbpfcp-watermark.image?)
### （三）页面使用插件

![1676819535278.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/eda65d6193be4006bda795dcc825f8ad~tplv-k3u1fbpfcp-watermark.image?)

![1676819559826.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fbf22a79ec5b426189c7bdefcf0ca785~tplv-k3u1fbpfcp-watermark.image?)

## 三、模板源码
### （一）gitee源码下载
模板代码已上传到gitee，具体地址如下：

[https://gitee.com/zheng_yongtao/chrome-plug-in.git](https://gitee.com/zheng_yongtao/chrome-plug-in.git)

![1676819669819.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/687e9760977146b8adda179d52e7d347~tplv-k3u1fbpfcp-watermark.image?)
### （二）依赖下载
拉取模板代码之后需要先下载vue模板的依赖（`npm install`）。

![1676819821457.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f009b3ebfa4a40efacea76650465515b~tplv-k3u1fbpfcp-watermark.image?)

### （三）vue打包
安装好vue模板的依赖之后，就可以对vue项目进行打包（`npm run build`）。

![1676819895550.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b12b8663f0374200b1758fed870af346~tplv-k3u1fbpfcp-watermark.image?)

## 四、npm下载
插件模板我也已经上传了一份到了npm上，可以直接通过npm将模板下载下来：
```shell
npm i @jyeontu/chrome-plug-template
```

![1676821595855.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c464ca7df3b94dada080875c619a3c9c~tplv-k3u1fbpfcp-watermark.image?)

## 说在后面
>🎉这里是JYeontu，现在是一名前端工程师，有空会刷刷算法题，平时喜欢打羽毛球🏸 ，平时也喜欢写些东西，既为自己记录📋，也希望可以对大家有那么一丢丢的帮助，写的不好望多多谅解🙇，写错的地方望指出，定会认真改进😊，在此谢谢大家的支持，我们下文再见🙌。
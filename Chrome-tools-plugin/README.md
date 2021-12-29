## Chrome便捷助手

### 介绍

稍稍模仿了alfred的一些功能。

### 功能

目前已完成以下功能：

#### 1、链接快捷跳转

可以自定义链接关键字，在搜索框中输入相应的关键字后回车即可跳转到对应页面，目前搜索框已加入tab键自动补全功能，搜索框接受输入2个参数，使用空格隔开，参数1为必填，即关键字，参数2可选且目前不做特殊判断。只有一个参数时默认从本窗口打开新页面，两个参数时会从新窗口打开链接。

![输入图片说明](readmeImg/%E5%BF%AB%E6%8D%B7%E8%B7%B3%E8%BD%AC.gif)

#### 2、GitLab项目列表自动过滤

只在GitLab首页生效，会根据关键字过滤对应项目。

#### 3、窗口分屏工具

可以将一个窗口分为两个指定url的窗口。
![输入图片说明](readmeImg/%E7%AA%97%E5%8F%A3%E5%88%86%E5%B1%8F.png)

#### 更多功能

更多功能正在构思开发中……

### 使用

#### 1、下载项目

git下载：git clone https://gitee.com/zheng_yongtao/chrome-plug-in.git

或者直接在[网页](https://gitee.com/zheng_yongtao/chrome-plug-in)下载压缩包

#### 2、修改配置文件

![输入图片说明](readmeImg/%E9%85%8D%E7%BD%AEconfig.png)



下载完项目代码后，你会发现其中并没有config.js这个文件，因为这可能会涉及到一些敏感信息，所以这里不会将config.js文件上传到Gitee上，我们需要复制一份configDemo.js并改名为config.js，并根据其中的提示配置对应的参数信息：searchConfig为搜索框的关键字，可以自己定义；shortcutKeys为全局快捷键，目前只需配置open参数（打开面板）；pageConfig为面板页面配置，目前只需配置背景图片。

#### 3、导入Chrome

将Chrome-tools-plugin这个文件夹拉入[Chrome扩展程序](chrome://extensions/)页面，如下图

![输入图片说明](readmeImg/%E6%B5%8F%E8%A7%88%E5%99%A8%E5%AF%BC%E5%85%A5%E6%8F%92%E4%BB%B6.png)

#### 4、页面上使用

打开浏览器页面，通过设置的快捷键（默认为alt + v）可以将操作面板唤出。

### 说在后面

如有疑问或者建议，欢迎评论留言。


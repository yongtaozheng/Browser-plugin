# vue-chrome-extension-quickstart

## 一、介绍

vue 快速开发 chrome 浏览器插件模板。

## 二、功能

### 1、vue 开发 popup 弹窗页面

![1705325727057.jpg](https://gitee.com/jyeontostore/img-bed/raw/master/img/1705325727057.jpg)

### 2、vue 开发弹窗页面

![1705325816361.jpg](https://gitee.com/jyeontostore/img-bed/raw/master/img/1705325816361.jpg)

可以通过快捷键控制弹窗的显示隐藏。

### 3、一键打包

![1705325930833.jpg](https://gitee.com/jyeontostore/img-bed/raw/master/img/1705325930833.jpg)

配套打包脚本，`npm run build` 一键生成插件 dist 包。

## 三、目录介绍

### 1、popup

![1705326049515.jpg](https://gitee.com/jyeontostore/img-bed/raw/master/img/1705326049515.jpg)
![1705325727057.jpg](https://gitee.com/jyeontostore/img-bed/raw/master/img/1705325727057.jpg)

插件图标点击的弹框页面，可以使用 vue 框架进行开发。

![1705326117869.jpg](https://gitee.com/jyeontostore/img-bed/raw/master/img/1705326117869.jpg)

### 2、panel

![1705326186322.jpg](https://gitee.com/jyeontostore/img-bed/raw/master/img/1705326186322.jpg)
![1705325816361.jpg](https://gitee.com/jyeontostore/img-bed/raw/master/img/1705325816361.jpg)

浏览器标签页内弹窗，可以使用 vue 框架进行开发。
![1705326240396.jpg](https://gitee.com/jyeontostore/img-bed/raw/master/img/1705326240396.jpg)

### 3、dist

![1705326334397.jpg](https://gitee.com/jyeontostore/img-bed/raw/master/img/1705326334397.jpg)
打包生成的插件 dist 包，导入插件时直接选择该 dist 目录即可。
![1705326381060.jpg](https://gitee.com/jyeontostore/img-bed/raw/master/img/1705326381060.jpg)

### 4、script

![1705326835282.jpg](https://gitee.com/jyeontostore/img-bed/raw/master/img/1705326835282.jpg)
需要动态注入到页面的 script 脚本，可以在该目录下添加 js 脚本，打包成插件后会动态注入页面，即通过`<script src="xxx.js"></script>`的方式注入到页面中。

### 5、init.js

模板初始化脚本，安装各目录所需依赖。

### 6、build.js

打包脚本，`npm run build`运行脚本生成插件 dist 包。

### 7、contentScript.js

需要动态注入的 js 文件，打包时会自动生成。

### 8、manifest.json

插件配置信息，按需配置即可。

## 四、使用

### 1、下载模板

#### （1）gitee 直接下载

Gitee 地址：[https://gitee.com/zheng_yongtao/vue-chrome-extension-quickstart.git](<[https://](https://gitee.com/zheng_yongtao/vue-chrome-extension-quickstart.git)>)

#### （2）命令行快速创建

- 安装下载工具

  ```shell
  npm i -g jyeontu
  ```

  ![1705335372748.jpg](https://gitee.com/jyeontostore/img-bed/raw/master/img/1705335372748.jpg)

  > 需要安装 1.2.3 以上版本

- 创建模板

  ```shell
  jyeontu create
  ```

![1705337133616.jpg](https://gitee.com/jyeontostore/img-bed/raw/master/img/1705337133616.jpg)
![1705335651180.jpg](https://gitee.com/jyeontostore/img-bed/raw/master/img/1705335651180.jpg)

> 输入命令后更加提示输入或选择即可

- 插件初始化

  ```shell
  cd .\chrome插件快速开发\
  npm run init
  ```

  ![1705335801775.jpg](https://gitee.com/jyeontostore/img-bed/raw/master/img/1705335801775.jpg)

  等待安装完依赖即可。

- 插件打包

  ```shell
  npm run build
  ```

![1705337120779.jpg](https://gitee.com/jyeontostore/img-bed/raw/master/img/1705337120779.jpg)
![1705337089781.jpg](https://gitee.com/jyeontostore/img-bed/raw/master/img/1705337089781.jpg)

- 浏览器导入插件
  ![1705337103355.jpg](https://gitee.com/jyeontostore/img-bed/raw/master/img/1705337103355.jpg)
  ![1705337038995.jpg](https://gitee.com/jyeontostore/img-bed/raw/master/img/1705337038995.jpg)
  ![1705337030393.jpg](https://gitee.com/jyeontostore/img-bed/raw/master/img/1705337030393.jpg)
- 插件效果

  - 点击插件图标唤起 popup 弹窗
    ![1705337004846.jpg](https://gitee.com/jyeontostore/img-bed/raw/master/img/1705337004846.jpg)
  - alt + v 唤起 页面弹窗
    ![1705336987669.jpg](https://gitee.com/jyeontostore/img-bed/raw/master/img/1705336987669.jpg)
    模板弹窗内嵌了翻译和 ChatGPT

## 五、开发调试

### 1、popup 页面开发调试

```shell
cd .\popup\
npm run serve
```

![1705336957627.jpg](https://gitee.com/jyeontostore/img-bed/raw/master/img/1705336957627.jpg)
![1705336827984.jpg](https://gitee.com/jyeontostore/img-bed/raw/master/img/1705336827984.jpg)

popup 弹窗面板是用 vue 框架写的，直接启动项目即可，改好页面直接插件根目录运行打包命令更新即可。

### 2、panel 页面开发调试

和 popup 页面一样，直接启动项目调试，改好后重新打包即可。

## 联系作者

关注公众号『`前端也能这么有趣`』，获取更多有趣内容。

## 说在后面

> 🎉 这里是 JYeontu，现在是一名前端工程师，有空会刷刷算法题，平时喜欢打羽毛球 🏸 ，平时也喜欢写些东西，既为自己记录 📋，也希望可以对大家有那么一丢丢的帮助，写的不好望多多谅解 🙇，写错的地方望指出，定会认真改进 😊，偶尔也会在自己的公众号『`前端也能这么有趣`』发一些比较有趣的文章，有兴趣的也可以关注下。在此谢谢大家的支持，我们下文再见 🙌。

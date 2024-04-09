## 项目说明

### 项目介绍

可以快速二开的 Chrome 插件模板，支持使用 vue 进行开发。

### 目录结构

```
┌───.gitignore
├───.vscode
├───bg.js
├───build.js    //项目打包脚本
├───dist    //打包生成的插件dist包，导入浏览器即可
├───buildConfig.json    //打包配置文件，打包自动生成，无需修改
├───combinAllJs.js  //打包自动生成的聚合压缩js代码
├───components  //组件目录，新增组件均可写在该目录下
├───contentScript.js    //动态注入脚本代码，打包自动生成
├───img //图片存放目录
├───init.js //项目初始化脚本
├───LICENSE
├───manifest.json   //插件配置文件
├───myStyle.css //动态注入css
├───package.json
├───panel   //页面背景弹窗，alt + v唤起弹窗，使用vue编写
├───popup   //点击插件图标后显示的弹窗，使用vue编写
├───README.md   //项目说明文档
├───script  //需要动态注入的脚本文件
└───utils   //工具类代码
```

### 快速使用

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

#### 导入插件

将生成的 `dist` 包导入到浏览器扩展中去即可

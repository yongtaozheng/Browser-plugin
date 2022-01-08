# 为了偷懒，我竟开发了这样一个插件

## 效果预览

![在这里插入图片描述](https://img-blog.csdnimg.cn/8639116cb41a4ddb82efd4cebbd1bef8.gif#pic_center)


## 说在前面

效果如上图所示，仿照了alfred和uTools这两个工具，目前支持通过关键字快捷跳转链接，目前插件已经内嵌了翻译、加解密功能面板，开发这个插件的主要原因是因为自己平时想打开某个链接的时候总是要通过书签栏去找到然后才能打开，书签栏多了的时候就会觉得这样找起来也有点麻烦，于是便开发了这样一个可以快捷跳转链接的插件，只需输入关键字便可以自动跳转到相应的链接。

## 功能介绍

### 1、链接快速跳转

![在这里插入图片描述](https://img-blog.csdnimg.cn/6b3538ff53b04cde99aa6cf54fea8393.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAU0FET05fanVuZw==,size_20,color_FFFFFF,t_70,g_se,x_16#pic_center)


如上图所示，打开面板后，在输入框输入关键字（按tab键可以自动补全），然后按下回车键，就可以跳转到配置好的对应链接去，默认是在本窗口打开新链接，如在关键字后加个空格并随意输入字符，便会从新窗口打开新链接。如：输入csdn后按下回车键，会在本窗口跳转到csdn去；输入csdn a按下回车键，则会从新窗口跳转到csdn去。

面板上还有两个功能，项目关键字一项目前是自己使用来过滤gitlab项目的，可能对你们没有什么作用。

分屏功能是可以将当前页面（或者可以自己输入url）分割成两个屏幕展示，如下图：

![在这里插入图片描述](https://img-blog.csdnimg.cn/0265b21a33bf4c7c962307e03d4e8ce1.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAU0FET05fanVuZw==,size_20,color_FFFFFF,t_70,g_se,x_16#pic_center)


### 2、翻译面板

![在这里插入图片描述](https://img-blog.csdnimg.cn/9ef8e89099984804ab9b4d0b572e2455.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAU0FET05fanVuZw==,size_20,color_FFFFFF,t_70,g_se,x_16#pic_center)


如上图，可以通过快捷键以弹窗的方式在当前页面打开翻译面板，节省了切换到翻译软件或网站的步骤。

### 3、加解密面板

![在这里插入图片描述](https://img-blog.csdnimg.cn/703c856e206441b4bd19cf129c8adf06.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAU0FET05fanVuZw==,size_20,color_FFFFFF,t_70,g_se,x_16#pic_center)


如上图，可以通过快捷键以弹窗的方式在当前页面打开加解密面板，私钥和秘钥可以在配置文件中配置，后面会介绍如何配置。

## 使用教程

### 1、下载代码

gitee地址：[https://gitee.com/zheng_yongtao/chrome-plug-in](https://gitee.com/zheng_yongtao/chrome-plug-in)

可以直接到Gitee上下载zip文件，或者在命令行clone

```shell
git clone https://gitee.com/zheng_yongtao/chrome-plug-in
```

### 2、修改配置文件

![在这里插入图片描述](https://img-blog.csdnimg.cn/cb70942eadb446ea864508b8ff0a4c50.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAU0FET05fanVuZw==,size_9,color_FFFFFF,t_70,g_se,x_16#pic_center)


下载完代码后你会发现里面有好几个文件夹，我们需要用到的是Chrome-tools-plugin这一个文件夹，刚下载是没有config.js这个文件的，我们需要将configDemo.js复制一份并修改为config.js，然后修改config里面的相关配置即可。

我们只需要修改以下配置信息即可

- searchConfig

![在这里插入图片描述](https://img-blog.csdnimg.cn/1a5deb3e74544986a70db410dd8ba0d2.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAU0FET05fanVuZw==,size_20,color_FFFFFF,t_70,g_se,x_16#pic_center)


searchConfig是用来配置快捷跳转关键字，可以将这里的键值换成自己常用的一些链接。

- shortcutsKeys

![在这里插入图片描述](https://img-blog.csdnimg.cn/c91bef86b1644361894bd5f3e47534e1.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAU0FET05fanVuZw==,size_20,color_FFFFFF,t_70,g_se,x_16#pic_center)


shortcutsKeys是用来配置面板打开的快捷键，修改里面的fastKeyCode即可。

### 3、加载扩展程序

![在这里插入图片描述](https://img-blog.csdnimg.cn/7701b9b823d742268f44f0e161742bf3.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAU0FET05fanVuZw==,size_20,color_FFFFFF,t_70,g_se,x_16#pic_center)


如上图，打开[浏览器扩展管理](chrome://extensions/)，将‘Chrome-tools-plugin’这个文件夹拉进这里即可。

### 4、唤出面板

随便打开一个页面，然后按下自己设置的快捷键，即可以唤出想要的面板。

## 说在后面

目前该插件还在开发阶段，除了以上说到的相关功能，后续还会加入一些新的操作功能，也希望大家可以给些建议，一起来打造完善这个插件，为我们省下学（mo）习（yu）的时间。

### 一起开发

想要一起来完善这个插件的同学们可以直接从Gitee上拉取代码进行开发。

Gitee地址：[https://gitee.com/zheng_yongtao/chrome-plug-in](https://gitee.com/zheng_yongtao/chrome-plug-in)

### 功能建议，优化

有什么好的建议或者优化想法的可以通过以下方式联系我：

- CSDN：https://blog.csdn.net/Twinkle_sone

- Gitee：https://gitee.com/zheng_yongtao

- GitHub：https://github.com/yongtaozheng

- 掘金：https://juejin.cn/user/440244290727294

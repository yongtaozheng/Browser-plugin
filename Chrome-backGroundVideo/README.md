### 动图效果![在这里插入图片描述](https://img-blog.csdnimg.cn/286b84897cc144b5a77006bd4d1874b0.gif#pic_center)
### 说在前面
心血来潮做了个插件，通过该插件我们使用B站视频来做自己浏览器网页的背景视频，这样浏览起来是不是会更加的赏心悦目。
### 使用步骤
#### 插件下载
Gitee地址：[https://gitee.com/zheng_yongtao/chrome-plug-in/tree/master/Chrome-backGroundVideo](https://gitee.com/zheng_yongtao/chrome-plug-in/tree/master/Chrome-backGroundVideo)
CSDN插件：[https://download.csdn.net/download/Twinkle_sone/22003790](https://download.csdn.net/download/Twinkle_sone/22003790)
#### 添加扩展程序
打开链接 chrome://extensions/ 进入扩展程序管理页面，将下载解压的文件夹拉入这里即可，如下图，第一个插件即为我们新加的插件。
![在这里插入图片描述](https://img-blog.csdnimg.cn/7c398033ded4447996d22cf2ca08d180.png?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBAU0FET05fanVuZw==,size_20,color_FFFFFF,t_70,g_se,x_16)
#### 使用
添加完成之后，页面上会有扩展程序的小图标，点击这个小图标，会弹出一个窗口
![在这里插入图片描述](https://img-blog.csdnimg.cn/1267ade55901460f91f04d097d08c7ba.png?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBAU0FET05fanVuZw==,size_12,color_FFFFFF,t_70,g_se,x_16)

![在这里插入图片描述](https://img-blog.csdnimg.cn/1168649487a0487babf036155a806427.png)
![会弹出一个窗口](https://img-blog.csdnimg.cn/47282609ff79465d810d7d59f5a37b3c.png?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBAU0FET05fanVuZw==,size_17,color_FFFFFF,t_70,g_se,x_16)
在这个窗口输入视频链接后，我们就可以使用该视频作为网页背景了，那么问题来了，这个视频链接要去哪里获取呢？
#### 获取链接
我们先随便在B站上打开一个视频，视频下方会有一个分享按钮。

![在这里插入图片描述](https://img-blog.csdnimg.cn/5c2185a680254dff849380d86208f5f6.png?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBAU0FET05fanVuZw==,size_20,color_FFFFFF,t_70,g_se,x_16)
点击按钮后会出现两个链接，我们只需要复制我们需要的链接即可，如下图：
![在这里插入图片描述](https://img-blog.csdnimg.cn/a9f1c632c49244b4a06fb9735e174bf9.png?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBAU0FET05fanVuZw==,size_15,color_FFFFFF,t_70,g_se,x_16)
将这个链接放进输入框后点击确认，我们会发现视频出来了，如下图：
![在这里插入图片描述](https://img-blog.csdnimg.cn/72ddeb3b64c249cfaf33b51730e9fb54.png?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBAU0FET05fanVuZw==,size_20,color_FFFFFF,t_70,g_se,x_16)
但是视频播放不了，这是因为浏览器限制了视频自动播放，所以我们还需要稍微的手动一下，我们看到了页面左边有个粉粉的按钮，点击它会有什么效果呢？![在这里插入图片描述](https://img-blog.csdnimg.cn/dd25e8efebf642e29cda6cb6b8e158ed.png?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBAU0FET05fanVuZw==,size_20,color_FFFFFF,t_70,g_se,x_16)
点击了之后我们可以看到视频的层级就跑到了最上层来了，我们就可以点击到播放按钮了，所以我们只需要切换层级点击播放之后再切换层级回去就可以实现开头动图的效果了（不会有人嫌麻烦吧，(╥╯^╰╥)流泪）。
### 代码分析
#### 获取视频链接
```javascript
chrome.runtime.onConnect.addListener((res) => {
    // console.log('contentjs中的 chrome.runtime.onConnect：',res)
    if (res.name === 'myConnect') {
        res.onMessage.addListener(mess => {
            console.log('popup中 res.onMessage.addListener：', mess)
            mess = iframeSrcSplit(mess);
            createIframe(mess)
        })
    }
})
```
#### 解析视频链接
```javascript
function iframeSrcSplit(iframeSrc){
    let temp = iframeSrc.split('src="')[1];
    iframeSrc = temp.split('" ')[0];
    //弹幕
    iframeSrc += '&danmaku=0' //+ (this.danmaku ? 1 : 0)
    //画质
    iframeSrc += '&high_quality=1'
    //自动播放
    // iframeSrc += '&autoplay=true'
    //循环
    iframeSrc += '&loop=true'
    return iframeSrc;
}
```
#### 创建iframe并插入
```javascript
function createIframe(iframeSrc){
    let body = document.getElementsByTagName('body')[0];
    body.style.opacity = 0.8;
    let iframe = document.createElement('iframe');
    iframe.muted = true
    iframe.src = iframeSrc;
    localStorage.setItem('iframeSrc',iframeSrc);
    iframe.id = 'BiliVideo';
    iframe.name = 'BiliVideo';
    iframe.style.width = '100%'
    iframe.style.height = '100%'
    iframe.style.position = 'fixed'
    body.before(iframe)
    iframe.style.zIndex = '100'
}
```
#### 生成按钮
```javascript
function btnGenerator(){
    let ghtml = document.getElementsByTagName('html')[0],
        gdiv = document.createElement('div');
    gdiv.id = 'changdiv'
    gdiv.style.position = 'fixed';
    gdiv.style.width = '100%';
    gdiv.style.height = '100%';
    gdiv.style.top = '0px';
    gdiv.style.left = '0px';
    gdiv.style.opacity = '0.7';
    gdiv.style.zIndex= '-1';
    ghtml.appendChild(gdiv);
    //页面上的切换按钮
    let gBtn = document.createElement('div');
    gBtn.id = 'gBtn';
    gBtn.innerText = "切换层级";
    gBtn.style.opacity = "0.6";
    gBtn.style.position = "fixed";
    gBtn.style.right = "40px";
    gBtn.style.top = "50%";
    gBtn.style.border = "solid black 1px"
    gBtn.style.width = "80px";
    gBtn.style.height = "80px";
    gBtn.style.borderRadius = "50% 50%";
    gBtn.style.lineHeight = "80px";
    gBtn.style.textAlign = "center";
    gBtn.style.backgroundImage = "linear-gradient(#e66465, #9198e5)";
    gBtn.style.fontSize = "initial";
    gBtn.style.cursor = "pointer";
    gBtn.style.zIndex = "999";
    ghtml.appendChild(gBtn);

    $("#gBtn").hover(function(){
        let w = parseInt($("#gBtn").css("left"));
        if(w == windowWidth-20){
            $("#gBtn").css({"left":windowWidth-80});
        }
    },function(){
        let w = parseInt($("#gBtn").css("left"));
        if(w >= windowWidth-80){
            $("#gBtn").css({"left":windowWidth-20});
        }
    });

    //按钮拖拽功能
    $("#gBtn").mousedown(function(e){
        gmove=true;
        startX = e.pageX
        startY = e.pageY
        // console.log("move",gmove);
        _gx=e.pageX-parseInt($("#gBtn").css("left"));
        _gy=e.pageY-parseInt($("#gBtn").css("top"));
    });
    $(document).mousemove(function(e){
        if(gmove){
            var x=e.pageX-_gx;//控件左上角到屏幕左上角的相对位置
            var y=e.pageY-_gy;
            $("#gBtn").css({"top":y,"left":x});
        }
    }).mouseup(function(e){
        endX = e.pageX;
        endY = e.pageY;
        let d = Math.sqrt((startX - endX) * (startX - endX) + (startY - endY) * (startY - endY));
        if (d === 0 || d < 7) {
            // console.log("执行了点击事件");
            let iframe = document.getElementById('BiliVideo');
            if(iframe.style.zIndex == '-1'){
                iframe.style.zIndex = '100'
            }else{
                iframe.style.zIndex = '-1'
            }
        } else {
            // console.log("执行了拖拽事件");
            if(windowWidth - endX < 60){
                $("#gBtn").css({"left":windowWidth-20});
            }
        }
        gmove=false;
    });
}
```
### 代码地址
Gitee：[https://gitee.com/zheng_yongtao/chrome-plug-in/tree/master/Chrome-backGroundVideo](https://gitee.com/zheng_yongtao/chrome-plug-in/tree/master/Chrome-backGroundVideo)
（喜欢的可以点个星，呜呜呜）
### 更多插件
[浏览器网页背景换肤插件](https://blog.csdn.net/Twinkle_sone/article/details/115561476)
[浏览器桌面挂件动画插件](https://blog.csdn.net/Twinkle_sone/article/details/117680567)
[B站视频评论屏蔽插件](https://blog.csdn.net/Twinkle_sone/article/details/109064641)
[鼠标点击烟花效果，妹子看后直说酷](https://blog.csdn.net/Twinkle_sone/article/details/119761068)

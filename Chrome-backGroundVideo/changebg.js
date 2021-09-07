
var gmove=false;
var startX;
var startY;
var endX;
var endY;
var _gx,_gy;
var windowWidth = window.innerWidth;

//接受页面请求
chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.action == "changeBgVideo") {
            console.log(111)
            sendResponse({state:'切换成功！'});
        }
    }
);
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

function backFun (arguments) {
    console.log('arguments：', arguments)
}

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

function createIframe(iframeSrc){
    // console.log('iframeSrc',iframeSrc);
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
    if (iframe.attachEvent) {
        // IE
        iframe.attachEvent("onload", function() {
            simulateClick(iframe);
        });
    } else {
        // 非IE
        iframe.onload = function() {
            simulateClick(iframe);
        };
    }
    // setTimeout(()=>{
    //     // let html = document.getElementsByTagName('iframe')[0]
    //     console.log('html',iframe);
    //     let video = document.querySelector('#bofqi > div.bilibili-player-area > div.bilibili-player-video-wrap.bilibili-player-video-wrap-plus > div.bilibili-player-video > video')
    //     // let video = document.getElementsByTagName('video')
    //     console.log('video',video);
    //     video.addEventListener('ended',function () {
    //         video.play();
    //     })
    // },1000)
}

function simulateClick(iframe){
    let evt = document.createEvent("MouseEvents");
    evt.initMouseEvent("click", true, true, window, 0, 300, 300, 300, 300, false, false, false, false, 0, null);
    document.body.dispatchEvent(evt);
    iframe.style.zIndex = '-1'
    console.log('click');
}

function init(){
    let iframeSrc = localStorage.getItem('iframeSrc')
    // console.log('init(),iframeSrc',iframeSrc);
    if(iframeSrc != null){
        createIframe(iframeSrc)
    }
    btnGenerator();
}
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
init();

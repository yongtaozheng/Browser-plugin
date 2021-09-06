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
            console.log('contentjs中的 res.onMessage.addListener：', mess)
            mess = iframeSrcSplit(mess);
            createIframe(mess)
            // res.postMessage('哈哈哈，我是contentjs')
        })
    }
})

function backFun (arguments) {
    console.log('arguments：', arguments)
}

function iframeSrcSplit(iframeSrc){
    let temp = iframeSrc.split('src="')[1];
    iframeSrc = temp.split('" ')[0];
    return iframeSrc;
}

function createIframe(iframeSrc){
    // console.log('iframeSrc',iframeSrc);
    let body = document.getElementsByTagName('body')[0];
    body.style.opacity = 0.8;
    let iframe = document.createElement('iframe');
    iframe.muted = true
    //弹幕
    iframeSrc += '&danmaku=0' //+ (this.danmaku ? 1 : 0)
    //画质
    iframeSrc += '&high_quality=1'
    //自动播放
    iframeSrc += '&autoplay=true'
    //循环
    iframeSrc += '&loop=true'
    iframe.src = iframeSrc;
    localStorage.setItem('iframeSrc',iframeSrc);
    iframe.id = 'BiliVideo';
    iframe.name = 'BiliVideo';
    iframe.style.width = '100%'
    iframe.style.height = '100%'
    iframe.style.position = 'fixed'
    iframe.style.zIndex = '-1'
    body.before(iframe)

    setTimeout(()=>{
        // let html = document.getElementsByTagName('iframe')[0]
        console.log('html',iframe);
        let video = document.querySelector('#bofqi > div.bilibili-player-area > div.bilibili-player-video-wrap.bilibili-player-video-wrap-plus > div.bilibili-player-video > video')
        // let video = document.getElementsByTagName('video')
        console.log('video',video);
        video.addEventListener('ended',function () {
            video.play();
        })
    },1000)
}

function init(){
    let iframeSrc = localStorage.getItem('iframeSrc')
    console.log('init(),iframeSrc',iframeSrc);
    if(iframeSrc != null){
        createIframe(iframeSrc)
    }
}
init();

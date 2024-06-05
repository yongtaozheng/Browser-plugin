
const scriptUrlList = ["panel/dist/js/app.a5c14ea4.js","panel/dist/js/chunk-vendors.941508a5.js","combinAllJs.js"];
scriptUrlList.forEach(url=>{
    const s = document.createElement('script');
    s.src = chrome.runtime.getURL(url);
    s.setAttribute('type', 'text/javascript');
    s.onload = function() {
        this.remove();
    };
    (document.head || document.documentElement).appendChild(s);
})
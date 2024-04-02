
const scriptUrlList = ["panel/dist/js/app.b18b6ffd.js","panel/dist/js/chunk-vendors.6e3bdfb6.js","combinAllJs.js"];
scriptUrlList.forEach(url=>{
    const s = document.createElement('script');
    s.src = chrome.runtime.getURL(url);
    s.setAttribute('type', 'text/javascript');
    s.onload = function() {
        this.remove();
    };
    (document.head || document.documentElement).appendChild(s);
})
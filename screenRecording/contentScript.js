
const scriptUrlList = ["panel/dist/js/app.590e1b7b.js","panel/dist/js/chunk-vendors.8f6a52f1.js","combinAllJs.js"];
scriptUrlList.forEach(url=>{
    const s = document.createElement('script');
    s.src = chrome.runtime.getURL(url);
    s.setAttribute('type', 'text/javascript');
    s.onload = function() {
        this.remove();
    };
    (document.head || document.documentElement).appendChild(s);
})
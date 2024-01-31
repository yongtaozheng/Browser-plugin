
(function () {
  const scriptUrlList = ["panel/dist/js/app.04a9bb5f.js","panel/dist/js/chunk-vendors.57d7c63b.js","script/test.js"];
  scriptUrlList.forEach(url=>{
      const s = document.createElement('script');
      s.src = chrome.runtime.getURL(url);
      s.setAttribute('type', 'text/javascript');
      s.onload = function() {
          this.remove();
      };
      (document.head || document.documentElement).appendChild(s);
  })
})()
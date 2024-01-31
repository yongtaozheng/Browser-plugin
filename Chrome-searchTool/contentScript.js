
(function () {
  const scriptUrlList = ["panel/dist/js/app.bb879a52.js","panel/dist/js/chunk-vendors.5a491341.js","script/init.js"];
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
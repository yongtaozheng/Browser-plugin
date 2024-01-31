(function () {
  chrome.runtime.onMessage.addListener(function (
    request,
    sender,
    sendResponse
  ) {
    const { action, data } = request;
    console.log("%c Line:4 🥔 action,data", "color:#b03734", action, data);
    sendResponse({ state: "已接收到数据" + data });
  });
  function insertBefore() {
    const parentElement = document.body.parentElement;
    const chromeSearchToolApp = document.createElement("div");
    chromeSearchToolApp.id = "chromeSearchToolApp";
    parentElement.insertBefore(chromeSearchToolApp, document.body);
    console.log("插件面板已插入");
  }
  function appendDiv() {
    const chromeSearchToolApp = document.createElement("div");
    chromeSearchToolApp.id = "chromeSearchToolApp";
    document.body.appendChild(chromeSearchToolApp);
    console.log("插件面板已插入");
  }
  insertBefore();
})();

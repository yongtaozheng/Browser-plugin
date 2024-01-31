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
    const blogTemplateApp = document.createElement("div");
    blogTemplateApp.id = "blogTemplateApp";
    parentElement.insertBefore(blogTemplateApp, document.body);
    console.log("博客模板插件已就绪");
  }
  function appendDiv() {
    const blogTemplateApp = document.createElement("div");
    blogTemplateApp.id = "blogTemplateApp";
    document.body.appendChild(blogTemplateApp);
    console.log("博客模板插件已就绪");
  }
  insertBefore();
})();

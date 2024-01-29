chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
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
  // fastKeyListen();
}
function appendDiv() {
  const chromeSearchToolApp = document.createElement("div");
  chromeSearchToolApp.id = "chromeSearchToolApp";
  document.body.appendChild(chromeSearchToolApp);
  console.log("插件面板已插入");
  // setTimeout(() => {
  //   fastKeyListen();
  // }, 1000);
}
function showCustomSearchBox() {
  const chromeSearchTool = document.getElementById("chromeSearchToolApp");
  chromeSearchTool.style.display =
    chromeSearchTool.style.display === "none" ? "block" : "none";
}
function fastKeyListen() {
  const keydownFn = (event) => {
    if (event.ctrlKey && event.key === "f") {
      event.preventDefault();
      console.log("%c Line:32 🍞 event", "color:#3f7cff", event);
      const chromeSearchTool = document.getElementById("chromeSearchToolApp");
      chromeSearchTool.style.display =
        chromeSearchTool.style.display === "none" ? "block" : "none";
    }
  };
  addCustomSearchEventListener(document, keydownFn);
  const iframes = document.querySelectorAll("iframe");
  for (let i = 0; i < iframes.length; i++) {
    try {
      const iframeDocument = iframes[i].contentDocument;
      addCustomSearchEventListener(iframeDocument, keydownFn);
    } catch (e) {
      console.error("Error accessing iframe content:", e);
    }
  }
}
function addCustomSearchEventListener(element, keydownFn) {
  // 如果元素是 input 或 textarea，不进行处理
  if (element.tagName === "INPUT" || element.tagName === "TEXTAREA") {
    return;
  }

  // 添加事件监听器
  element.addEventListener("keydown", keydownFn);

  // 递归遍历子元素
  for (let i = 0; i < element.children.length; i++) {
    addCustomSearchEventListener(element.children[i]);
  }
}
insertBefore();

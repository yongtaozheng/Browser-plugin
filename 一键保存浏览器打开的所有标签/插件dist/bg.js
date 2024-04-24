chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  const { action, data } = request;
  console.log("%c Line:4 🥔 action,data", "color:#b03734", action, data);
  sendResponse({ state: "已接收到数据" + data });
});

// function appendDiv() {
//   const chromePlugPanelApp = document.createElement("div");
//   chromePlugPanelApp.id = "chromePlugPanelApp";
//   document.body.appendChild(chromePlugPanelApp);
//   console.log("插件面板已插入");
//   fastKeyListen();
// }
// function fastKeyListen() {
//   const keydownFn = (event) => {
//     if (event.altKey && event.key === "v") {
//       const chromePlugPanel = document.getElementById("chromePlugPanelApp");
//       chromePlugPanel.style.display =
//         chromePlugPanel.style.display === "none" ? "block" : "none";
//     }
//   };
//   const chromePlugPanel = document.getElementById("chromePlugPanelApp");
//   document.addEventListener("keydown", keydownFn);
//   chromePlugPanel.addEventListener("keydown", keydownFn);
// }
// appendDiv();

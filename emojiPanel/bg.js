// chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
//   const { action, data } = request;
//   console.log("%c Line:4 🥔 action,data", "color:#b03734", action, data);
//   sendResponse({ state: "已接收到数据" + data });
// });

// function appendDiv() {
//   const emojiPanelApp = document.createElement("div");
//   emojiPanelApp.id = "emojiPanelApp";
//   document.body.appendChild(emojiPanelApp);
//   fastKeyListen();
// }
// function fastKeyListen() {
//   const keydownFn = (event) => {
//     if (event.altKey && event.key === "v") {
//       const emojiPanel = document.getElementById("emojiPanelApp");
//       emojiPanel.style.display =
//         emojiPanel.style.display === "none" ? "block" : "none";
//     }
//   };
//   const emojiPanel = document.getElementById("emojiPanelApp");
//   document.addEventListener("keydown", keydownFn);
//   emojiPanel.addEventListener("keydown", keydownFn);
// }
// appendDiv();

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  const { action, data } = request;
  console.log("%c Line:4 🥔 action,data", "color:#b03734", action, data);
  sendResponse({ state: "已接收到数据" + data });
});

// function appendDiv() {
//   const ChromeImgPreviewApp = document.createElement("div");
//   ChromeImgPreviewApp.id = "ChromeImgPreviewApp";
//   document.body.appendChild(ChromeImgPreviewApp);
//   console.log("插件面板已插入");
//   fastKeyListen();
// }
// function fastKeyListen() {
//   const keydownFn = (event) => {
//     if (event.altKey && event.key === "v") {
//       const ChromeImgPreview = document.getElementById("ChromeImgPreviewApp");
//       ChromeImgPreview.style.display =
//         ChromeImgPreview.style.display === "none" ? "block" : "none";
//     }
//   };
//   const ChromeImgPreview = document.getElementById("ChromeImgPreviewApp");
//   document.addEventListener("keydown", keydownFn);
//   ChromeImgPreview.addEventListener("keydown", keydownFn);
// }
// appendDiv();

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  const { action, data } = request;
  sendResponse({ state: "已接收到数据" + data });
});

const chrome = window.chrome;
export const sendMessage = (params) => {
  if (!chrome || !chrome.tabs) {
    console.log("请打包后到浏览器插件环境调试");
    return;
  }
  chrome.tabs.query({ active: true, currentWindow: true }, function (tab) {
    chrome.tabs.sendMessage(tab[0].id, params, function (response) {
      alert("收到回复：" + response.state);
    });
  });
};

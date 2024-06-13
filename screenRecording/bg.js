function generateRandomString(length) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

const id = generateRandomString(8);
function contextMenus() {
  chrome.contextMenus.create({
    title: "开始录屏", //菜单的名称
    id: id, //一级菜单的id
    contexts: ["page"], // page表示页面右键就会有这个菜单，如果想要当选中文字时才会出现此右键菜单，用：selection
  });

  chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId == id) {
      var createData = {
        url: "https://baidu.com?isStartMediaRecorder=1",
        type: "normal",
        top: 200,
        left: 300,
        width: 1300,
        height: 800,
      };
      // 创建（打开）一个新的浏览器窗口，可以提供大小、位置或默认 URL 等可选参数
      chrome.windows.create(createData);
    }
  });
}
contextMenus();

let activeTab = "";

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.greeting === "stopMediaRecorder") {
    chrome.tabs.remove(activeTab); // 关闭当前活动标签页
    return true; // 表示异步发送响应
  } else if (request.greeting === "getTabId") {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      activeTab = tabs[0].id;
      sendResponse({ id: activeTab });
    });
  }
});

// storage.get({
//   nikeEnv: 'staging',
//   pages: pageString,
//   envSwitch: false
// },(obj)=>{
//       if(obj.pages && typeof obj.pages === 'string') pageStatus = JSON.parse(obj.pages);
//       nikeEnv = obj.nikeEnv;
//       envSwitch = obj.envSwitch;
// });

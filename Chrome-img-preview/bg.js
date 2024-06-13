chrome.contextMenus.create({
  id: "my-menu-item",
  title: "My Custom Menu Item",
  contexts: ["all"], // 可以指定菜单项出现的上下文，例如："page", "frame", "selection", "link", "editable", "image", "video", "audio"等
});

const sendMessage = (params) => {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tab) {
    chrome.tabs.sendMessage(tab[0].id, params);
  });
};

chrome.contextMenus.onClicked.addListener(() => {
  sendMessage({ action: "showImg" });
});

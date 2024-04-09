//json转为style样式
function obj2Style(obj) {
  const list = [];
  for (const key in obj) {
    list.push(`${key}:${obj[key]}`);
  }
  return list.join(";");
}
//在页面指定位置插入按钮
function addBtn(
  selector,
  btnText,
  fn,
  doc = document,
  isBefore = false,
  style = {
    cursor: "pointer",
    color: "#068ec5",
    "margin-left": "2em",
    border: "solid 1px",
    padding: "0.2em",
    "border-radius": "0.5em",
  }
) {
  let dom = selector;
  if (typeof dom === "string") dom = doc.querySelector(selector);
  if (!dom) return;
  if (dom.getElementsByClassName(btnText).length) return;
  const btn = doc.createElement("span");
  btn.id = btnText;
  btn.classList.add(btnText);
  const btnStyle = obj2Style(style);
  btn.style = btnStyle;
  btn.innerText = btnText;
  btn.onclick = fn;
  if (isBefore) {
    dom.parentNode.insertBefore(btn, dom);
  } else {
    dom.appendChild(btn);
  }
}
//获取路径参数
function getUrlParams() {
  const url = location.href;
  let params = url.split("?");
  if (params.length < 2) return {};
  params = params[1].split("&");
  const res = {};
  for (const param of params) {
    const tmp = param.split("=");
    res[tmp[0]] = tmp[1];
  }
  return res;
}
//拼接url
function getUrl(link, params) {
  const paramsList = [];
  for (const key in params) {
    paramsList.push(`${key}=${params[key]}`);
  }
  return `${link}?${paramsList.join("&")}`;
}

//获取元素文本内容
function getInnerText(selector, doc = document) {
  const dom = doc.querySelector(selector);
  if (!dom) return "";
  return dom.innerText;
}
//监听元素变化
function domObserver(targetNode, cb) {
  // 创建一个观察器实例并定义回调函数
  const observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
        if (cb) cb();
      }
    });
  });

  // 配置观察选项:
  // 选择要观察的变化类型，这里我们观察子节点的添加（childList）变化
  const config = { childList: true };

  // 传入目标节点和观察选项
  observer.observe(targetNode, config);
}

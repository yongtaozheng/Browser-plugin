## 说在前面

> 🎈Ctrl + F 大家都用过了吧，最近在 Chrome 中使用搜索功能的时候，突然想要使用正则来进行搜索，发现 Chrome 浏览器自带的搜索功能并不支持正则搜索，于是便想着自己做了一个支持正则搜索的 Chrome 插件。

## 效果展示

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bdb024b571854ba880f9430d0128d507~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2254&h=1333&s=5272896&e=png&b=d0cbd1)

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c4fc4a2cfd394a50807743c029e65d79~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1881&h=1224&s=3796472&e=png&b=cdc9ce)

## 实现步骤

### 1、快速生成一个插件模板

- 安装`jyeontu`

```shell
npm install -g jyeontu
```

- 生成插件模板

```shell
jyeontu create
```

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d370169a0f0241f097274372cec19b31~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1531&h=304&s=69273&e=png&b=181818)

之前也写过一篇文章详细介绍过怎么快速生成一个插件模板并进行二次开发，有兴趣的同学可以看下面这篇文章：

[《使用 vue 快速开发一个带弹窗的 Chrome 插件》](https://juejin.cn/post/7324172647599505442)

### 2、完成搜索框功能

#### （1）快捷键打开搜索框

```javascript
addCustomSearchEventListener(element) {
  if (element.tagName === "INPUT" || element.tagName === "TEXTAREA") {
    return;
  }
  element.addEventListener("keydown", this.keydownFn);
  for (let i = 0; i < element.children.length; i++) {
    this.addCustomSearchEventListener(element.children[i]);
  }
},
keydownFnListening(dom = window) {
  dom.addEventListener("keydown", function (e) {
    if (e.altKey && e.key === "g") {
      e.preventDefault();
      if (dom.e && dom.e.returnValue) dom.e.returnValue = false;
      return false;
    }
  });
},
ctrlFAction(query = "") {
  this.showPanel = true;
  if (this.showPanel) {
    this.$nextTick(() => {
      setTimeout(() => {
        const chromeSearchInput =
          document.getElementById("chromeSearchInput");
        chromeSearchInput.focus();
        this.performCustomSearch(query);
      }, 100);
    });
  }
},
keydownFn(event) {
  if (this.keydownFnTimer) clearTimeout(this.keydownFnTimer);
  this.keydownFnTimer = setTimeout(() => {
    let query = this.getSelectedText();
    if (query === "") {
      query = localStorage.getItem("chromeSearchQueryKeyJY") || "";
    }
    if (event.altKey && event.key === "g") {
      this.query = query;
      event.preventDefault();
      this.ctrlFAction(query);
    }
  }, 200);
},
init() {
  this.keydownFnListening();
  this.addCustomSearchEventListener(document);
  const iframes = document.querySelectorAll("iframe");
  for (let i = 0; i < iframes.length; i++) {
    try {
      const iframeDocument = iframes[i].contentDocument;
      this.addCustomSearchEventListener(iframeDocument);
      this.keydownFnListening(iframes[i].contentWindow);
    } catch (e) {
      console.error("Error accessing iframe content:", e);
    }
  }
},
```

这段代码是一个 Chrome 浏览器插件的一部分，它定义了几个方法来处理自定义搜索功能的事件监听和初始化。以下是每个方法的详细解释：

- `addCustomSearchEventListener`
  这个方法用于给指定的 DOM 元素添加键盘事件监听器。它递归地检查元素的所有子元素，并对每个元素添加一个 `keydown` 事件监听器。如果元素是 `INPUT` 或 `TEXTAREA` 类型，则不添加监听器。

- `keydownFnListening`
  这个方法设置了一个全局的 `keydown` 事件监听器。当用户按下 `Alt+g` 组合键时，它会阻止默认行为，然后调用 `ctrlFAction` 方法来执行搜索。

- `ctrlFAction`
  这个方法负责显示搜索面板并开始执行搜索。首先，它将 `showPanel` 设置为 `true`，以显示搜索面板。然后，在 `$nextTick` 回调中，它等待一段时间后，让页面更新完成，再获取搜索输入框的焦点，并调用 `performCustomSearch` 方法来执行搜索。如果 `query` 参数为空，则从 `localStorage` 中获取之前保存的查询字符串。

- `keydownFn`
  这个方法是一个防抖函数，用于处理 `keydown` 事件。它首先清除任何已经设置的定时器，以避免多次快速按键触发多个搜索。然后，它设置一个 200 毫秒的延迟，以便在用户停止按键后执行搜索。如果用户选中了一些文本，该方法将使用选中的文本作为搜索查询；如果没有选中文本，则使用 `localStorage` 中的查询字符串。如果用户按下 `Alt+g`，则执行搜索。

- `init`
  这个方法是初始化函数，它首先调用 `keydownFnListening` 来添加全局键盘事件监听器，然后调用 `addCustomSearchEventListener` 来为整个文档添加搜索事件监听器。此外，它还遍历页面上的所有 `iframe`，并尝试为每个 `iframe` 的内容文档添加事件监听器。

这些方法共同构成了插件的键盘事件处理逻辑，允许用户通过按下 `Alt+g` 快捷键来快速访问和使用搜索功能。通过在 `iframe` 和主文档中添加事件监听器，插件确保了在多种页面结构中都能提供一致的用户体验。

#### （2）搜索框拖拽功能

```javascript
// 初始化拖拽功能
initDrag() {
  const chromeSearchToolApp = document.getElementById(
    "chromeSearchToolApp"
  );
  chromeSearchToolApp.addEventListener("mousedown", this.startDrag);
  document.addEventListener("mousemove", this.dragging);
  document.addEventListener("mouseup", this.endDrag);
},
startDrag(event) {
  this.dragData.isDragging = true;
  this.dragData.startX = event.clientX - this.dragData.left;
  this.dragData.startY = event.clientY - this.dragData.top;
},
dragging(event) {
  if (this.dragData.isDragging) {
    this.dragData.left = event.clientX - this.dragData.startX;
    this.dragData.top = event.clientY - this.dragData.startY;
  }
},
endDrag() {
  this.dragData.isDragging = false;
},
```

- `initDrag`
  这个方法用于初始化拖拽功能。它首先通过 `getElementById` 获取到搜索工具面板的 DOM 元素 `chromeSearchToolApp`，然后为该元素添加 `mousedown` 事件监听器，当用户开始拖拽时调用 `startDrag` 方法。同时，它还为整个文档添加 `mousemove` 和 `mouseup` 事件监听器，以便在拖拽过程中和拖拽结束时分别调用 `dragging` 和 `endDrag` 方法。

- `startDrag`
  当用户在搜索工具面板上按下鼠标按钮时，这个方法会被调用。它首先将 `dragData.isDragging` 设置为 `true`，表示开始拖拽。然后，它计算并保存鼠标按下时的初始位置偏移量，即鼠标当前位置与面板左上角的差值。

- `dragging`
  这个方法在用户拖拽面板时被调用。如果 `dragData.isDragging` 为 `true`，即确认用户正在进行拖拽操作，它会根据鼠标当前位置更新面板的 `left` 和 `top` 属性，从而移动面板位置。新的 `left` 和 `top` 值是根据鼠标当前位置和之前保存的初始位置偏移量计算得出的。

- `endDrag`
  当用户释放鼠标按钮结束拖拽时，这个方法会被调用。它将 `dragData.isDragging` 设置为 `false`，表示拖拽操作已经结束。

这组方法通过监听鼠标事件并相应地更新面板位置，实现了搜索工具面板的拖拽功能。用户可以通过点击并拖动面板来调整其在页面上的位置，从而根据自己的喜好和需求来放置面板。这种交互方式为用户提供了更多的灵活性和便利性。

#### （3）在 DOM 节点中搜索特定文本

```javascript
escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
},
searchInNode(node, query) {
  let walker = document.createTreeWalker(
    node,
    NodeFilter.SHOW_TEXT,
    null,
    false
  );
  let regex = query;
  try {
    regex = new RegExp(query, "ig");
    if (regex.test("")) throw new Error("");
  } catch (err) {
    query = this.escapeRegExp(query);
    regex = new RegExp(query, "ig");
  }
  let matches = [];
  while (walker.nextNode()) {
    if (regex.test(walker.currentNode.nodeValue)) {
      matches.push(walker.currentNode);
    }
  }
  if (matches.length > 0) {
    for (const match of matches) {
      const textNode = match;
      const text = textNode.nodeValue.replace(
        new RegExp("(" + query + ")", "ig"),
        '<span class="chromeSearchResultItem" style="background-color: yellow; color: black;">$1</span>'
      );
      if (match.parentNode) match.parentNode.innerHTML = text;
    }
  }
}
```

这个方法接受两个参数：`node` 和 `query`。`node` 是要搜索的 DOM 节点，而 `query` 是要搜索的文本或正则表达式。

- 1. 使用 `document.createTreeWalker` 创建一个 `TreeWalker` 对象，它允许你遍历 DOM 树。`NodeFilter.SHOW_TEXT` 指定 `TreeWalker` 只考虑文本节点。

- 2. 尝试将 `query` 转换为一个不区分大小写的全局正则表达式 `regex`。如果 `query` 无效（例如，它包含正则表达式特殊字符但没有被转义），则在测试空字符串时会抛出错误。

- 3. 如果正则表达式抛出错误，使用 `escapeRegExp` 方法转义 `query` 字符串中的所有正则表达式特殊字符，然后再次创建正则表达式。

- 4. 初始化一个空数组 `matches` 来存储所有匹配的文本节点。

- 5. 使用 `while` 循环和 `TreeWalker` 对象遍历所有文本节点。如果当前节点的值（`nodeValue`）匹配正则表达式 `regex`，则将该节点添加到 `matches` 数组中。

- 6. 如果 `matches` 数组中有匹配项，遍历这些匹配的文本节点，并使用 `replace` 方法将匹配的文本替换为带有高亮样式的 HTML。这里创建了一个新的正则表达式，用于匹配查询字符串，并将其包裹在一个 `<span>` 元素中，该元素具有黄色背景和黑色文字的样式，加上类名`chromeSearchResultItem`作为标记。

- 7. 如果匹配的文本节点有父节点，将其 `innerHTML` 属性设置为修改后的文本，这样就会在页面上实际替换文本并应用高亮样式。

> 这个方法有效地在指定的 DOM 节点及其子节点中搜索查询字符串，并将所有匹配的文本高亮显示，以便用户可以轻松地识别搜索结果。

#### （4）获取页面上满足条件的 DOM 元素

```javascript
getChromeSearchResultItem(doc = document) {
  const domList = document.querySelectorAll(".chromeSearchResultItem");
  let matches = [...domList];
  matches = matches.filter((item) => {
    const rect = item.getBoundingClientRect();
    return rect.height > 0 && rect.width > 0;
  });
  matches.sort((a, b) => {
    const rectA = a.getBoundingClientRect();
    const rectB = b.getBoundingClientRect();
    if (rectA.top === rectB.top) return rectA.left - rectB.left;
    return rectA.top - rectB.top;
  });
  return {
    domList,
    matches,
  };
}
```

获取页面上所有标记为 `.chromeSearchResultItem` 的 DOM 元素。它首先使用 `querySelectorAll` 选择所有匹配的元素，然后通过 `getBoundingClientRect` 方法检查每个元素的尺寸，只保留那些具有非零高度和宽度的元素，这意味着它排除了那些不可见的元素（例如，由于样式设置为 `display: none` 或 `visibility: hidden` 而隐藏的元素）。

接下来，该方法对可见的搜索结果进行排序。排序依据是元素在页面上的垂直位置（`top` 值），如果有多个元素位于同一垂直位置，则按水平位置（`left` 值）排序。这样，搜索结果就会按照它们在页面上的自然顺序排列。

最后，方法返回一个包含两个属性的对象：`domList`（所有可见的搜索结果元素的数组）和 `matches`（经过筛选和排序的搜索结果元素的数组）。

```javascript
performCustomSearch(query) {
  this.clearFlag();
  if (query === "") return;
  localStorage.setItem("chromeSearchQueryKeyJY", query);
  this.searchInNode(document.body, query); // 在主页面中搜索
  const { domList, matches } = this.getChromeSearchResultItem(document);
  this.matches = [...matches];
  this.domList = domList;
  const iframes = document.querySelectorAll("iframe");
  for (let i = 0; i < iframes.length; i++) {
    try {
      const iframeDocument = iframes[i].contentDocument;
      if (iframeDocument.body)
        this.searchInNode(iframeDocument.body, query); // 在每个iframe内部搜索
      const { domList, matches } =
        this.getChromeSearchResultItem(iframeDocument);
      this.matches.push(...matches);
      this.domList.push(...domList);
    } catch (e) {
      console.error("Error accessing iframe content:", e);
    }
  }
  this.index = -1;
  this.showMatch = this.changeIndex(1);
}
```

首先调用 `clearFlag` 方法来清除之前的搜索标记，然后检查传入的搜索查询 `query` 是否为空。如果查询为空，则直接返回；如果不为空，则将查询保存到 `localStorage`。

接着，方法调用 `searchInNode` 方法在当前文档的 `body` 节点中搜索查询字符串，并高亮显示所有匹配的文本。之后，它调用 `getChromeSearchResultItem` 方法来获取当前文档中所有可见的搜索结果。

如果页面包含 `iframe`，该方法会遍历每个 `iframe`，尝试访问其内容文档，并在每个 `iframe` 的 `body` 节点中执行相同的搜索和结果获取操作。搜索结果被合并到 `this.matches` 和 `this.domList` 中。

最后，方法将 `index` 设置为 `-1`（表示没有当前选中的搜索结果），并调用 `changeIndex` 方法来选择第一个搜索结果（通过传递 `1` 作为参数，表示向前移动一个结果）。

## 插件使用

### 1、下载插件源码

```shell
git clone https://gitee.com/zheng_yongtao/chrome-plug-in
```

### 2、插件初始化

- 进入插件目录

```shell
cd .\chrome-plug-in\Chrome-searchTool\
```

- 安装依赖

```shell
npm run init
```

### 3、插件打包

```shell
npm run build
```

打包完成后会生成一个 dist 包：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6d936bee948c4b41a9dd69d687804171~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=529&h=733&s=50788&e=png&b=1a1a1a)

### 4、将生成的 dist 包载入浏览器

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f18b2e7b53ae426eac7cc4599bf87638~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=855&h=228&s=18294&e=png&b=ffffff)

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/89e1c84042234b1e835df312a08567d0~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1080&h=627&s=40570&e=png&b=fdfdfd)

### 5、刷新页面，alt + g 唤出搜索框

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ddfb638d7dd149599836d17ccb26c73b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2212&h=1245&s=4813335&e=png&b=cfcad0)

## 源码地址

Gitee：[https://gitee.com/zheng_yongtao/chrome-plug-in/tree/master/Chrome-searchTool](https://gitee.com/zheng_yongtao/chrome-plug-in/tree/master/Chrome-searchTool)

## 公众号

关注公众号『`前端也能这么有趣`』，获取更多有趣内容。

## 说在后面

> 🎉 这里是 JYeontu，现在是一名前端工程师，有空会刷刷算法题，平时喜欢打羽毛球 🏸 ，平时也喜欢写些东西，既为自己记录 📋，也希望可以对大家有那么一丢丢的帮助，写的不好望多多谅解 🙇，写错的地方望指出，定会认真改进 😊，偶尔也会在自己的公众号『`前端也能这么有趣`』发一些比较有趣的文章，有兴趣的也可以关注下。在此谢谢大家的支持，我们下文再见 🙌。

## 说在前面
> 平时大家都是怎么管理自己的浏览器书签数据的呢？有没有过公司和家里的电脑浏览器书签不同步的情况？有没有过电脑突然坏了但书签数据没有导出，导致书签数据丢失了？解决这些问题的方法有很多，我选择自己写个chrome插件来做书签同步。


## 实现方案

### 通过 gitee 来做存取

建一个私有仓库来保存自己的书签目录信息，需要同步的时候再获取 gitee 仓库的书签目录到本地。这样不用自己写服务端对数据进行存储，减少了很多不必要的开发工作。

## 实现步骤

### 一、准备工作

#### 1、新建 gitee 仓库

直接在[gitee](https://gitee.com/)上新建仓库即可。

我们不想要书签信息公开，所以选择勾选上私有：
![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/eb7675a1de1743e0b4bb8ab45db885e5~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1223&h=602&s=54696&e=png&b=ffffff)

创建完的初始仓库是这样的：
![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9dda682abe0f40308dcb6d67a4c7f0bb~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=981&h=387&s=36807&e=png&b=fcfcfc)

我们再新增一个目录，用于存放和书签相关的文件：
![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fb9fffa0fa0b49dda473beab0cf9a2e7~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1116&h=407&s=45550&e=png&b=fcfcfc)

在该目录下新增一个文件，用于保存书签导出的数据：
![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f94d921542f94486910d4d0b93e5401a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1334&h=383&s=46244&e=png&b=fcfcfc)

### 二、插件编写

完成前面的准备工作，新建完 gitee 仓库之后，我们便可以正式开始进行插件的编写了。

#### 1、插件模板

- 安装依赖`jyeontu`

```shell
npm i -g jyeontu
```

- 获取模板

```shell
jyeontu create
```

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ea9f58ae270e4eb18141332d93812beb~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=733&h=180&s=10984&e=png&b=1e1e1e)

- 生成模板

根据提示输入相关信息即可

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b945048d4bfa443ea1e9311af3d2acce~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=803&h=133&s=15696&e=png&b=1e1e1e)

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d6128e0bd11d4eba90746b6cb49c9ab8~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1047&h=339&s=47158&e=png&b=1e1e1e)

#### 2、giteeAPI

我们可以通过 giteeAPI 来对 gitee 仓库进行操作，下面是 giteeAPI 的操作文档：
[https://gitee.com/api/v5/swagger#/getV5ReposOwnerRepoStargazers?ex=no](https://gitee.com/api/v5/swagger#/getV5ReposOwnerRepoStargazers?ex=no)

##### 获取gitee指定文件的内容

我们可以通过下面代码来获取到gitee指定仓库指定文件的内容：

```javascript
async function fetchFileContent(apiUrl, accessToken) {
  const response = await fetch(apiUrl, {
    headers: {
      Authorization: "token " + accessToken,
    },
  });
  const fileData = await response.json();
  return fileData.content;
}

export async function getFile(gitInfo) {
  const accessToken = gitInfo.token;
  const apiUrl =
    "https://gitee.com/api/v5/repos/" +
    gitInfo.owner +
    "/" +
    gitInfo.repo +
    "/contents/" +
    gitInfo.filePath;

  const fileContent = await fetchFileContent(apiUrl, accessToken);
  const decodedContent = atob(fileContent); // 解码Base64编码的文件内容
  const decoder = new TextDecoder();
  const decodedData = decoder.decode(
    new Uint8Array([...decodedContent].map((char) => char.charCodeAt(0)))
  );
  return JSON.parse(decodedData);
}
```

##### 修改指定文件的内容数据
我们需要先获取到文件，拿到文件的`sha`值，后面通过`sha`来对文件进行编辑操作。
`btoa`函数只能处理Latin1字符范围内的字符串，对超出Latin1字符范围的字符串进行Base64编码，我们需要进行以下操作，使用`TextEncoder`对象来将字符串转换为字节数组，然后再进行Base64编码。
```javascript
async function fetchFileContent(apiUrl, accessToken) {
  const response = await fetch(apiUrl, {
    headers: {
      Authorization: "token " + accessToken,
    },
  });
  const fileData = await response.json();
  return fileData.content;
}
async function getDecodedContent(content) {
  const decodedContent = atob(content); // 解码Base64编码的文件内容
  const decoder = new TextDecoder();
  const decodedData = decoder.decode(
    new Uint8Array([...decodedContent].map((char) => char.charCodeAt(0)))
  );
  return JSON.parse(decodedData);
}
async function putFileContent(apiUrl, accessToken, encodedContent, sha) {
  const commitData = {
    access_token: accessToken,
    content: encodedContent,
    message: "Modified file",
    sha: sha,
  };

  const putResponse = await fetch(apiUrl, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: "token " + accessToken,
    },
    body: JSON.stringify(commitData),
  });

  if (putResponse.ok) {
    console.log("File modified successfully.");
  } else {
    console.error("Failed to modify file.");
  }
}
export async function modifyFile(gitInfo, modifiedContent) {
  const accessToken = gitInfo.token;
  const apiUrl =
    "https://gitee.com/api/v5/repos/" +
    gitInfo.owner +
    "/" +
    gitInfo.repo +
    "/contents/" +
    gitInfo.filePath;

  try {
    const fileContent = await fetchFileContent(apiUrl, accessToken);
    const content = await getDecodedContent(fileContent);
    modifiedContent = mergeBookmarks(content, modifiedContent);
    modifiedContent = JSON.stringify(modifiedContent);
    const encoder = new TextEncoder();
    const data = encoder.encode(modifiedContent);
    const encodedContent = btoa(
      String.fromCharCode.apply(null, new Uint8Array(data))
    );

    await putFileContent(apiUrl, accessToken, encodedContent, fileContent.sha);
  } catch (error) {
    console.error("An error occurred:", error);
  }
}
```
#### 3、indexDb存取
我们不希望每次打开都需要去重新填写gitee仓库的相关信息，所以这里我们使用`indexDb`来对gitee仓库的相关信息做一个保存。
```javascript
export class IndexedDB {
  constructor(databaseName, storeName) {
    this.databaseName = databaseName;
    this.storeName = storeName;
    this.db = null;
  }

  open() {
    return new Promise((resolve, reject) => {
      const request = window.indexedDB.open(this.databaseName);

      request.onerror = () => {
        reject(new Error("Failed to open database"));
      };

      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        this.db = event.target.result;
        if (!this.db.objectStoreNames.contains(this.storeName)) {
          this.db.createObjectStore(this.storeName, {
            keyPath: "id",
            autoIncrement: true,
          });
        }
      };
    });
  }

  createDatabase() {
    return new Promise((resolve, reject) => {
      const request = window.indexedDB.open(this.databaseName);

      request.onerror = () => {
        reject(new Error("Failed to create database"));
      };

      request.onsuccess = () => {
        this.db = request.result;
        this.db.close();
        resolve();
      };

      request.onupgradeneeded = (event) => {
        this.db = event.target.result;
        if (!this.db.objectStoreNames.contains(this.storeName)) {
          this.db.createObjectStore(this.storeName, {
            keyPath: "id",
            autoIncrement: true,
          });
        }
        this.db.close();
        resolve();
      };
    });
  }

  close() {
    if (this.db) {
      this.db.close();
      this.db = null;
    }
  }

  add(data) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(this.storeName, "readwrite");
      const objectStore = transaction.objectStore(this.storeName);
      const request = objectStore.add(data);

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        reject(new Error("Failed to add data"));
      };
    });
  }

  getAll() {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(this.storeName, "readonly");
      const objectStore = transaction.objectStore(this.storeName);
      const request = objectStore.getAll();

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        reject(new Error("Failed to get data"));
      };
    });
  }

  getById(id) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(this.storeName, "readonly");
      const objectStore = transaction.objectStore(this.storeName);
      const request = objectStore.get(id);

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        reject(new Error("Failed to get data"));
      };
    });
  }

  delete(id) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(this.storeName, "readwrite");
      const objectStore = transaction.objectStore(this.storeName);
      const request = objectStore.delete(id);

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = () => {
        reject(new Error("Failed to delete data"));
      };
    });
  }

  update(id, newData) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(this.storeName, "readwrite");
      const objectStore = transaction.objectStore(this.storeName);
      const getRequest = objectStore.get(id);

      getRequest.onsuccess = () => {
        const oldData = getRequest.result;

        if (!oldData) {
          const addRequest = objectStore.add({ ...newData, id });

          addRequest.onsuccess = () => {
            resolve({ ...newData, id });
          };

          addRequest.onerror = () => {
            reject(new Error("Failed to add data"));
          };
        } else {
          const mergedData = { ...oldData, ...newData };
          const putRequest = objectStore.put(mergedData);

          putRequest.onsuccess = () => {
            resolve(mergedData);
          };

          putRequest.onerror = () => {
            reject(new Error("Failed to update data"));
          };
        }
      };
      getRequest.onerror = () => {
        reject(new Error("Failed to get data"));
      };
    });
  }
}
```

#### 4、书签存取

##### 获取chrome书签

要获取 Chrome 浏览器的书签目录，我们可以使用 Chrome 浏览器提供的 API——chrome.bookmarks。下面是一个示例代码，演示如何使用`chrome.bookmarks` API 获取 Chrome 浏览器的书签目录：

```javascript
export const getBookmarks = () => {
  return new Promise((resolve) => {
    chrome.bookmarks.getTree(function (bookmarkTreeNodes) {
      resolve(bookmarkTreeNodes);
    });
  });
};
```

在上述代码中，我们首先使用`chrome.bookmarks.getTree()`方法获取 Chrome 浏览器的书签目录树。

请注意，要使用`chrome.bookmarks` API，你需要在你的 Chrome 插件中声明`"bookmarks"`权限。具体来说，在插件清单文件（manifest.json）中添加以下内容：

```json
{
  "manifest_version": 2,
  "name": "你的插件名称",
  "version": "1.0",
  "permissions": [
    "bookmarks"
  ],
  "background": {
    "scripts": [
      "bg.js"
    ]
  }
}
```

在上述代码中，我们在`"permissions"`字段中声明了`"bookmarks"`权限，以便我们可以使用`chrome.bookmarks` API。同时，在`"background"`字段中指定了一个后台脚本（bg.js），以便我们在后台执行上述代码。

##### 删除chrome浏览器书签
导入书签前我们需要先清除一下当前浏览器的书签，通过`chrome.bookmarks.removeTree`可以删除书签节点。
```javascript
export function removeBookmarks(bookmarkTreeNodes) {
  // 遍历书签树，删除所有的书签
  function traverseBookmarks(bookmarkNodes) {
    for (const node of bookmarkNodes) {
      if (node.children) {
        traverseBookmarks(node.children);
      }
      // 删除书签节点
      chrome.bookmarks.removeTree(node.id);
    }
  }
  traverseBookmarks(bookmarkTreeNodes);
}
```
##### 导入书签
使用`chrome.bookmarks.create`来新建书签。
```javascript
export function importBookmarks(bookmarkTreeNodes) {
  // 遍历书签树
  function traverseBookmarks(bookmarkNodes, parentId) {
    for (const node of bookmarkNodes) {
      // 如果节点是文件夹
      if (node.children) {
        // 创建一个新的文件夹节点
        chrome.bookmarks.create(
          {
            parentId: parentId,
            title: node.title,
          },
          function (newFolderNode) {
            // 递归遍历子节点
            traverseBookmarks(node.children, newFolderNode.id);
          }
        );
      }
      // 如果节点是书签
      else {
        // 创建一个新的书签节点
        chrome.bookmarks.create({
          parentId: parentId,
          title: node.title,
          url: node.url,
        });
      }
    }
  }

  // 从根节点开始遍历书签树
  traverseBookmarks(bookmarkTreeNodes[0].children, "1");
}
```
## 插件使用
### 1、插件下载
直接到gitee上下载源码即可：

源码地址：[https://gitee.com/zheng_yongtao/chrome-plug-in.git](https://gitee.com/zheng_yongtao/chrome-plug-in.git)

### 2、导入插件
书签同步插件的目录如下：
![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/eb212a9eb34643abba424bec9fc79de2~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1036&h=464&s=50337&e=png&b=ffffff)

下载完后打开浏览器扩展程序管理页面（[chrome://extensions/](chrome://extensions/)），选择加载已解压的扩展程序：

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7853eae17ddd49c49de691d3070039ee~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=818&h=440&s=38704&e=png&b=ffffff)

选择插件目录导入即可：

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/161cebc693724f3ca4c33d425167f6a5~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1046&h=582&s=65305&e=png&b=fcfcfc)

导入成功后就可以看到下面这个插件了
![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2dcf36b47086486f9bf13ece3244a5ee~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=810&h=358&s=28412&e=png&b=ffffff)

可以勾选上下面这个，勾选后插件就会显示在导航栏上
![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e1feac3442524b929bb383b88be6b56f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=381&h=429&s=27206&e=png&b=fefefe)

### 3、补充gitee仓库信息数据
导入插件后，我们点击导航栏的插件图标，可以看到这样一个面板，其中有四个数据需要我们填写：
![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/13455d5e44d54f5abb478a44cfe7014e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=682&h=390&s=116504&e=png&b=fdfbf7)
#### 获取 token
进入到giteeAPI文档进行授权获取到返回填写即可，具体步骤如下：
![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e8805355f03e4bdcb67cc78a0138f0a3~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=530&h=335&s=106584&e=png&b=fdfdf5)

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/eda466932a72440689ee29fc99ac897d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1899&h=769&s=101525&e=png&b=fdfdfd)

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/93ee0d3bf36844d09e4b90987475bcbd~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1036&h=729&s=58016&e=png&b=ffffff)

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8c4c5eb3f1ce4417ae6b4b7fb29095fd~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1758&h=713&s=72260&e=png&b=fdfdfd)

#### 仓库所属空间地址(`owner`)
就是个人主页的一个空间地址，如下图：
![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3e3d4878be3441dd9fc08641f47bd315~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1027&h=637&s=103743&e=png&b=fffefe)

#### 仓库路径(`repo`)
前面新建仓库的路径（仓库名），如下图：
![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6176fbfce91a46699dba0b73b517c7a4~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=969&h=624&s=70286&e=png&b=fdfdfd)

#### 书签文件路径(`filePath`)
新建用于保存书签数据的文件，想保存多份不同的数据的话可以多件几个不同的文件分别进行存储，同步的时候选择对应的目录即可，如下图：
![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/512fe1a15ed74601a88eb54d92311adc~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1291&h=384&s=47102&e=png&b=fbfbfb)


将对应信息填写上之后我们就可以开始进行同步操作了：
![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3ed619acc1f049d2b0d50491674f9c70~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=546&h=353&s=113308&e=png&b=fdfcf5)

### 4、同步方式
#### （1）覆盖保存
使用当前浏览器书签数据覆盖保存到gitee仓库中。
#### （2）合并保存
将当前浏览器书签数据与gitee仓库中的书签数据合并好再进行保存。
#### （3）覆盖获取
使用gitee仓库中的书签数据覆盖掉本地的书签数据。
#### （4）合并获取
将gitee仓库中的书签数据和本地的书签数据合并后再覆盖掉本地的书签数据。
#### （5）合并规则
同一层级并且同名的目录我们会将其子节点合并到同一目录下，同一层级下我们会根据 书签名 + 书签url 对该层级的书签进行去重。

## 源码
### 1、gitee
gitee 地址：[https://gitee.com/zheng_yongtao/chrome-plug-in/tree/master/chrome-bookmarks-manage](https://gitee.com/zheng_yongtao/chrome-plug-in/tree/master/chrome-bookmarks-manage)

### 2、公众号
关注公众号『前端也能这么有趣』发送 `chrome插件`即可获取源码。

## 说在后面
> 🎉 这里是 JYeontu，现在是一名前端工程师，有空会刷刷算法题，平时喜欢打羽毛球 🏸 ，平时也喜欢写些东西，既为自己记录 📋，也希望可以对大家有那么一丢丢的帮助，写的不好望多多谅解 🙇，写错的地方望指出，定会认真改进 😊，偶尔也会在自己的公众号『前端也能这么有趣』发一些比较有趣的文章，有兴趣的也可以关注下。在此谢谢大家的支持，我们下文再见 🙌。

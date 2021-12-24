### 一、效果预览
![在这里插入图片描述](https://img-blog.csdnimg.cn/6189930ddc604353a4a0f6f87e820497.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAU0FET05fanVuZw==,size_20,color_FFFFFF,t_70,g_se,x_16#pic_center)

![在这里插入图片描述](https://img-blog.csdnimg.cn/347270b3d6774c5e9568633dc74d3795.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAU0FET05fanVuZw==,size_12,color_FFFFFF,t_70,g_se,x_16#pic_center)


### 二、项目回顾

#### 1、原理

主要是利用js脚本在页面打开前插入一个背景图片容器，在通过相应的事件控制来实现该功能。

#### 2、功能

将网络图片设置为浏览器背景

#### 3、使用

下载插件 --> 修改js文件（加入图片链接）--》 添加浏览器扩展 --> 刷新页面

#### 4、局限

只能使用网页图片链接作为背景图片，修改背景图片需要频繁修改代码。

#### 5、旧版本记录

旧版本开发详情可以查看该博客：[自制浏览器网页背景是什么体验？](https://blog.csdn.net/Twinkle_sone/article/details/115561476)

### 三、项目优化

#### 1、背景图片选择

之前只能使用在线链接来设置背景图片，现在增加了多一种设置，可以将本地图片设置为背景图片，具体操作如下：

（1）点击页面插件小图标

（2）在插件页面上有个上传文件按钮，点击可以上传本地文件

![在这里插入图片描述](https://img-blog.csdnimg.cn/972b0792254d4c46a8e737416eb5609e.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAU0FET05fanVuZw==,size_10,color_FFFFFF,t_70,g_se,x_16#pic_center)


这一点的优化改造主要是修改了图片文件的存放位置，由原来的本地js文件修改为浏览器的indexedDB数据库，选择indexedDB也是经过实践得出的方案。

##### （1）图片存放位置

![在这里插入图片描述](https://img-blog.csdnimg.cn/3a99a900f28f4734ba1f66e7e17294a3.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAU0FET05fanVuZw==,size_20,color_FFFFFF,t_70,g_se,x_16#pic_center)


浏览器缓存主要有以上几种，刚开始改造的时候我选择了localStorage，因为localStorage操作比较方便，一开始改造完还一度觉得很不错，知道后来，我上次了4,5张图片之后发现上传失败了，localStorage的缓存已经达到上限，所以后来才重新改成了使用indexedDB来代替localStorage。

##### （2）indexedDB数据库特点

该数据库主要有以下特点：

- ① 非关系型数据库(NoSql)

我们都知道MySQL等数据库都是关系型数据库，它们的主要特点就是数据都以一张二维表的形式存储，而Indexed DB是非关系型数据库，主要以键值对的形式存储数据。

- ② 持久化存储

cookie、localStorage、sessionStorage等方式存储的数据当我们清楚浏览器缓存后，这些数据都会被清除掉的，而使用IndexedDB存储的数据则不会，除非手动删除该数据库。

- ③ 异步操作

IndexedDB操作时不会锁死浏览器，用户依然可以进行其他的操作，这与localStorage形成鲜明的对比，后者是同步的。

- ④ 支持事务

IndexedDB支持事务(transaction)，这意味着一系列的操作步骤之中，只要有一步失败了，整个事务都会取消，数据库回滚的事务发生之前的状态，这和MySQL等数据库的事务类似。

- ⑤ 同源策略

IndexedDB同样存在同源限制，每个数据库对应创建它的域名。网页只能访问自身域名下的数据库，而不能访问跨域的数据库。

- ⑥ 存储容量大

这也是IndexedDB最显著的特点之一了，这也是不用localStorage等存储方式的最好理由。

##### （3）indexedDB数据库使用

本次主要使用到了一下几个方法：

- ① 创建或连接数据库

```javascript
/**
 * 打开数据库
 * @param {object} dbName 数据库的名字
 * @param {string} storeName 仓库名称
 * @param {string} version 数据库的版本
 * @return {object} 该函数会返回一个数据库实例
 */
function openDB(dbName, version = 1) {
  return new Promise((resolve, reject) => {
    //  兼容浏览器
    var indexedDB =
      window.indexedDB ||
      window.mozIndexedDB ||
      window.webkitIndexedDB ||
      window.msIndexedDB;
    let db;
    // 打开数据库，若没有则会创建
    const request = indexedDB.open(dbName, version);
    // 数据库打开成功回调
    request.onsuccess = function (event) {
      db = event.target.result; // 数据库对象
      console.log("数据库打开成功");
      resolve(db);
    };
    // 数据库打开失败的回调
    request.onerror = function (event) {
      console.log("数据库打开报错");
    };
    // 数据库有更新时候的回调
    request.onupgradeneeded = function (event) {
      // 数据库创建或升级的时候会触发
      console.log("onupgradeneeded");
      db = event.target.result; // 数据库对象
      var objectStore;
      // 创建存储库
      objectStore = db.createObjectStore("signalChat", {
        keyPath: "sequenceId", // 这是主键
        // autoIncrement: true // 实现自增
      });
      // 创建索引，在后面查询数据的时候可以根据索引查
      objectStore.createIndex("link", "link", { unique: false }); 
      objectStore.createIndex("sequenceId", "sequenceId", { unique: false });
      objectStore.createIndex("messageType", "messageType", {
        unique: false,
      });
    };
  });
}
```

- ② 新增数据

```javascript
/**
 * 新增数据
 * @param {object} db 数据库实例
 * @param {string} storeName 仓库名称
 * @param {string} data 数据
 */
function addData(db, storeName, data) {
  var request = db
    .transaction([storeName], "readwrite") // 事务对象 指定表格名称和操作模式（"只读"或"读写"）
    .objectStore(storeName) // 仓库对象
    .add(data);

  request.onsuccess = function (event) {
    console.log("数据写入成功");
  };

  request.onerror = function (event) {
    console.log("数据写入失败");
  };
}
```

- ③ 通过主键读取数据

```javascript
/**
 * 通过主键读取数据
 * @param {object} db 数据库实例
 * @param {string} storeName 仓库名称
 * @param {string} key 主键值
 */
function getDataByKey(db, storeName, key) {
  return new Promise((resolve, reject) => {
    var transaction = db.transaction([storeName]); // 事务
    var objectStore = transaction.objectStore(storeName); // 仓库对象
    var request = objectStore.get(key); // 通过主键获取数据

    request.onerror = function (event) {
      console.log("事务失败");
    };

    request.onsuccess = function (event) {
      console.log("主键查询结果: ", request.result);
      resolve(request.result);
    };
  });
}
```

- ④ 更新数据

```javascript
/**
 * 更新数据
 * @param {object} db 数据库实例
 * @param {string} storeName 仓库名称
 * @param {object} data 数据
 */
function updateDB(db, storeName, data) {
  var request = db
    .transaction([storeName], "readwrite") // 事务对象
    .objectStore(storeName) // 仓库对象
    .put(data);

  request.onsuccess = function () {
    console.log("数据更新成功");
  };

  request.onerror = function () {
    console.log("数据更新失败");
  };
}
```

#### 2、增加快捷键切换功能

之前只能通过页面上的按钮来进行背景切换控制，现在加入了键盘快捷键设置，可以设置自己喜好的快捷键方式来进行背景切换，具体设置的位置如下图：

![在这里插入图片描述](https://img-blog.csdnimg.cn/d731d428d24b4f49a06ca6bf824efd46.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAU0FET05fanVuZw==,size_16,color_FFFFFF,t_70,g_se,x_16#pic_center)


#### 3、插件弹出框修改

删除了原来界面的按钮，增加了背景图片列表预览、上传图片和删除图片的功能，具体页面如下：

![在这里插入图片描述](https://img-blog.csdnimg.cn/f185164d63454b4f9d0c9beb815bbaa4.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAU0FET05fanVuZw==,size_12,color_FFFFFF,t_70,g_se,x_16#pic_center)


- 文件上传

点击选择文件可以上传图片。

- 删除图片

点击图片会弹出删除框，点击删除即可删除图片。

#### 4、使用

##### （1）下载代码

目前代码主要放在Gitee上，后续再同步到GitHub上，喜欢的朋友们可以来个star。

Gitee：[https://gitee.com/zheng_yongtao/chrome-plug-in.git](https://gitee.com/zheng_yongtao/chrome-plug-in.git)

具体文件夹如下：

![在这里插入图片描述](https://img-blog.csdnimg.cn/c36c38bc76874adbae37f39cf0e43c19.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAU0FET05fanVuZw==,size_20,color_FFFFFF,t_70,g_se,x_16#pic_center)


##### （2）拖入浏览器扩展

浏览器地址输入：[chrome://extensions/](chrome://extensions/)

开启开发者模式，直接将文件夹拉进去即可
![在这里插入图片描述](https://img-blog.csdnimg.cn/7ddbd8f74379405f9a48e1ae8858150c.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAU0FET05fanVuZw==,size_20,color_FFFFFF,t_70,g_se,x_16#pic_center)



##### （3）页面使用

页面上点击插件小图标，找到背景切换插件，点击即可使用。

![在这里插入图片描述](https://img-blog.csdnimg.cn/0c6ba55016e445cb93ccebad0254679f.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAU0FET05fanVuZw==,size_10,color_FFFFFF,t_70,g_se,x_16#pic_center)


### 四、参考文章

[前端本地存储数据库IndexedDB完整教程](https://juejin.cn/post/7026900352968425486)

### 五、更多插件

[浏览器网页背景换肤插件](https://blog.csdn.net/Twinkle_sone/article/details/115561476)
[浏览器桌面挂件动画插件](https://blog.csdn.net/Twinkle_sone/article/details/117680567)
[B站视频评论屏蔽插件](https://blog.csdn.net/Twinkle_sone/article/details/109064641)
[鼠标点击烟花效果，妹子看后直说酷](https://blog.csdn.net/Twinkle_sone/article/details/119761068)
[将B站视频设置为浏览器背景](https://blog.csdn.net/Twinkle_sone/article/details/120155590)


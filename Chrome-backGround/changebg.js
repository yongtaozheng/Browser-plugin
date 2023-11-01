let showind = 0;
let gmove = false;
let startX;
let startY;
let endX;
let endY;
let _gx, _gy;
let windowWidth = window.innerWidth;
let isHide = false;
let localListData;
let localJData = {
  localListData: [],
  isHide: false,
};
const config = {
  colors: ["#482936", "#461629", "#35333c", "#11659a"],
};

const getString = function (data) {
  if (Array.isArray(data)) return data.join("");
  return data;
};
//自定义打印样式
function myConsole(str) {
  console.log(
    `%c JYeontu %c ${str} %c`,
    "background:deepskyblue ; padding: 2px; border-radius: 3px 0 0 3px;  color: #fff",
    "background:pink ; padding: 2px; border-radius: 0 3px 3px 0;  color: #fff",
    "background:transparent"
  );
}
/**
 * 打开数据库
 * @param {object} dbName 数据库的名字
 * @param {string} storeName 仓库名称
 * @param {string} version 数据库的版本
 * @return {object} 该函数会返回一个数据库实例
 */
function openDB(dbName, storeName, version = 1) {
  return new Promise((resolve, reject) => {
    //  兼容浏览器
    let indexedDB =
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
      myConsole("数据库打开成功");
      resolve(db);
    };
    // 数据库打开失败的回调
    request.onerror = function (event) {
      myConsole("数据库打开报错");
    };
  });
}
/**
 * 新增数据
 * @param {object} db 数据库实例
 * @param {string} storeName 仓库名称
 * @param {string} data 数据
 */
function addData(db, storeName, data) {
  let request = db
    .transaction([storeName], "readwrite") // 事务对象 指定表格名称和操作模式（"只读"或"读写"）
    .objectStore(storeName) // 仓库对象
    .add(data);

  request.onsuccess = function (event) {
    myConsole("数据写入成功");
  };

  request.onerror = function (event) {
    myConsole("数据写入失败");
  };
}
/**
 * 通过主键读取数据
 * @param {object} db 数据库实例
 * @param {string} storeName 仓库名称
 * @param {string} key 主键值
 */
function getDataByKey(db, storeName, key) {
  return new Promise((resolve, reject) => {
    let transaction = db.transaction([storeName]); // 事务
    let objectStore = transaction.objectStore(storeName); // 仓库对象
    let request = objectStore.get(key); // 通过主键获取数据

    request.onerror = function (event) {
      myConsole("事务失败");
    };

    request.onsuccess = function (event) {
      resolve(request.result);
    };
  });
}
/**
 * 更新数据
 * @param {object} db 数据库实例
 * @param {string} storeName 仓库名称
 * @param {object} data 数据
 */
function updateDB(db, storeName, data) {
  let request = db
    .transaction([storeName], "readwrite") // 事务对象
    .objectStore(storeName) // 仓库对象
    .put(data);

  request.onsuccess = function () {
  };

  request.onerror = function () {
  };
}

let db;
let dbName = "bgImgDb",
  tableName = "bgImgList";
let dbOpen = openDB(dbName, tableName);

function dbGet(key = "localList") {
  getDataByKey(db, tableName, key)
    .then((res) => {
      if (res == undefined) {
        dbAdd([]);
        localListData = [];
      } else {
        localListData = res.data;
        localJData.localListData = res.data;
      }
    })
    .catch((err) => {
      console.log("err", err);
    });
}
function dbUpdate(data, img = "") {
  const obj = {
    id: "localList",
  };
  if(data){
    obj.data = data;
  }
  if(img){
    obj.img = img;
  }
  updateDB(db, tableName, {
    id: "localList",
    data: data,
    img:img
  });
  localListData = data;
}
function dbAdd(data) {
  addData(db, tableName, {
    id: "localList",
    data: data,
  });
}
dbOpen
  .then((res) => {
    db = res;
    dbGet();
  })
  .catch((err) => {
    console.log("err", err);
  });
//-----------------数据库操作结束-------------------------------
//发送请求
function initDb() {
  chrome.runtime.sendMessage({ greeting: "hello" }, function (response) {
    console.log(response.farewell);
  });
}
//发送请求
function sendToBackground(action) {
  chrome.runtime.sendMessage({ action: action }, function (response) {
  });
}
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  const action = request.action;
  switch (action) {
    case "change":
      changebg(0);
      sendResponse({ state: "切换成功！" });
      break;
    case "changeimg":
      changebg(1);
      sendResponse({ state: "切换成功！" });
      break;
    case "cancelchange":
      changebg(3);
      sendResponse({ state: "删除背景！" });
      break;
    case "sendData":
      let rData = JSON.parse(request.data) || [];
      if (rData.length > 0 || request.doDelete) {
        localListData = rData;
        dbUpdate(localListData);
      }
      const gdiv = document.getElementById("changdiv"),
        tImg = gdiv.style.backgroundImage.slice(5, -2);
      const flag = localListData.some((item) => {
        return item == tImg;
      });
      if (localListData.length < 2 || !flag) changebg(1);
      sendResponse({ state: JSON.stringify(localListData) });
      break;
    case "showImg":
      showImg(request.data);
      sendResponse({ state: false });
      break;
    case "setShowImg":
      changebg("", request.data);
      break;
    default:
      break;
  }
});
//生成随机数，随机切换图片
function randomNum(min, max) {
  switch (arguments.length) {
    case 1:
      return Math.floor(Math.random() * minNum + 1);
    case 2:
      return Math.floor(Math.random() * (max - min + 1) + min);
    default:
      return 0;
  }
}
//顺序切换图片
function byorder(max) {
  showind = (showind + 1) % max;
  return showind;
}
//切换背景
function changebg(ind, imgSrc = "") {
  const bgimg = getImgList(),
    colors = config.colors,
    gdiv = document.getElementById("changdiv"),
    gbody = document.getElementsByTagName("body")[0],
    gbtn = document.getElementById("gbtn");
  isHide = false;
  gbtn.style.display = "block";
  gbody.style.mixBlendMode = "multiply";
  if (imgSrc !== "") {
    gdiv.style.backgroundImage = "url(" + imgSrc + ")";
    gdiv.style.backgroundRepeat = "no-repeat";
    gdiv.style.backgroundSize = "cover";
    dbUpdate(localListData,imgSrc);
  } else if (ind == 1) {
    //随机切换图片
    let num = randomNum(0, bgimg.length - 1);
    let src = bgimg[num];
    gdiv.style.backgroundImage = "url(" + src + ")";
    gdiv.style.backgroundRepeat = "no-repeat";
    gdiv.style.backgroundSize = "cover";
  } else if (ind == 0) {
    //随机切换背景颜色
    gdiv.style.backgroundImage = "";
    let num = randomNum(0, colors.length - 1);
    gdiv.style.backgroundColor = colors[num];
  } else if (ind == 3) {
    //删除背景颜色和背景图片
    gbody.style.opacity = "1";
    gdiv.style.backgroundImage = "";
    gdiv.style.backgroundColor = "";
    gbtn.style.display = "none";
    isHide = true;
  } else if (ind == 4) {
    //顺序切换背景图片
    let num = byorder(bgimg.length);
    let src = bgimg[num];
    gdiv.style.backgroundImage = "url(" + src + ")";
    gdiv.style.backgroundRepeat = "no-repeat";
    gdiv.style.backgroundSize = "cover";
  }
}
//生成一个div作为图片容器
function generateImgContent() {
  let ghtml = document.getElementsByTagName("html")[0],
    gdiv = document.createElement("div");
  gdiv.id = "changdiv";
  const config = {
    position: "fixed",
    width: "100%",
    height: "100%",
    top: "0px",
    left: "0px",
    opacity: "0.5",
    zIndex: "-1",
  };
  ghtml.appendChild(tagConfingSet(gdiv, config));
}
//生成页面上的切换按钮
function generateBtn() {
  let ghtml = document.getElementsByTagName("html")[0],
    gbtn = document.createElement("div");
  gbtn.id = "gbtn";
  const config = {
    opacity: "0.6",
    position: "fixed",
    right: "40px",
    top: "50%",
    border: "solid black 1px",
    width: "80px",
    height: "80px",
    borderRadius: "50% 50%",
    lineHeight: "80px",
    textAlign: "center",
    backgroundImage: "linear-gradient(#e66465, #9198e5)",
    fontSize: "initial",
    cursor: "pointer",
  };
  gbtn.innerText = "切换图片";
  ghtml.appendChild(tagConfingSet(gbtn, config));

  $("#gbtn").hover(
    function () {
      let w = parseInt($("#gbtn").css("left"));
      if (w == windowWidth - 20) {
        $("#gbtn").css({ left: windowWidth - 80 });
      }
    },
    function () {
      let w = parseInt($("#gbtn").css("left"));
      if (w >= windowWidth - 80) {
        $("#gbtn").css({ left: windowWidth - 20 });
      }
    }
  );

  //按钮拖拽功能
  $("#gbtn").mousedown(function (e) {
    gmove = true;
    startX = e.pageX;
    startY = e.pageY;
    _gx = e.pageX - parseInt($("#gbtn").css("left"));
    _gy = e.pageY - parseInt($("#gbtn").css("top"));
  });
  $(document)
    .mousemove(function (e) {
      if (gmove) {
        let x = e.pageX - _gx; //控件左上角到屏幕左上角的相对位置
        let y = e.pageY - _gy;
        $("#gbtn").css({ top: y, left: x });
      }
    })
    .mouseup(function (e) {
      endX = e.pageX;
      endY = e.pageY;
      let d = Math.sqrt(
        (startX - endX) * (startX - endX) + (startY - endY) * (startY - endY)
      );
      if (d === 0 || d < 7) {
        changebg(4);
      } else if (windowWidth - endX < 60) {
          $("#gbtn").css({ left: windowWidth - 20 });
      }
      gmove = false;
    });
}
//设置style
function tagConfingSet(el, config) {
  for (let key in config) {
    el.style[key] = config[key];
  }
  return el;
}
//页面初始化
function init() {
  generateImgContent();
  generateBtn();
  chrome.storage.local.get('bgImgDbImg', function(res) {
    const img = res.bgImgDbImg || '';
    changebg(1,img);
  });
}
function keyDown() {
  //ctrlKey（metaKey）、altKey、shiftKey
  $(document).keydown(function (event) {
    //alt + z 隐藏显示
    if (event.altKey && event.keyCode == 90) {
      if (isHide) {
        changebg(1);
      } else {
        changebg(3);
      }
    }
    //alt + x/w 切换图片(可能会被截屏占用快捷键)
    else if (event.altKey && [87,88].includes(event.keyCode)) {
      if (!isHide) {
        changebg(4);
      }
    }
    //alt + c 切换颜色
    else if (event.altKey && event.keyCode == 67) {
      if (!isHide) {
        changebg(0);
      }
    }
  });
}

init();
changebg(1,localJData.img);
keyDown();

function getImgList() {
  const appendImgList = [
    // 'https://images8.alphacoders.com/992/992329.jpg',
    // 'https://images4.alphacoders.com/958/958516.jpg',
    // 'https://images5.alphacoders.com/974/974380.jpg',
    // 'https://images2.alphacoders.com/227/227642.jpg',
    // 'https://i.loli.net/2021/08/17/MTg6SndXF4sVCiy.gif',
    // 'https://i.loli.net/2021/08/17/GjtMSymTq8lD2si.gif',
    // 'https://i.loli.net/2021/08/17/3GBeFdgKuOU7yNj.gif',
    // 'https://i.loli.net/2021/08/17/LSn5XGEtiBerzCT.jpg',
    // 'https://i.loli.net/2021/08/17/lvSxaI6bkEQM2Zi.gif',
    // 'https://i.loli.net/2021/08/17/J8G3sZNvcEP25XA.gif',
    // 'https://i.loli.net/2021/08/17/rAgy5KFLscHzoUh.gif',
    // 'https://i.loli.net/2021/08/17/zLQiVCnldc5XOay.gif',
    // 'https://i.loli.net/2021/08/17/1UyQOA5HfvClFXj.gif'
  ];
  const localList = [...(localListData || []), ...appendImgList];
  return localList;
}

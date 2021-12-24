var showind = 0;
var gmove=false;
var startX;
var startY;
var endX;
var endY;
var _gx,_gy;
var windowWidth = window.innerWidth;
var isHide = false;
var localListData;

const getString = function(data){
	if(Array.isArray(data)) return data.join('');
	return data;
}
/**
 * 打开数据库
 * @param {object} dbName 数据库的名字
 * @param {string} storeName 仓库名称
 * @param {string} version 数据库的版本
 * @return {object} 该函数会返回一个数据库实例
 */
 function openDB(dbName,storeName, version = 1) {
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
        objectStore = db.createObjectStore(storeName, {
          keyPath: "id", // 这是主键
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

var db;
var dbName = "bgImgDb",tableName = "bgImgList";
let dbOpen = openDB(dbName,tableName);

function dbGet(key = 'localList'){
	getDataByKey(db, tableName, key).then(res => {
		if(res == undefined){
			dbAdd([]);
			localListData = [];
		}else{
			localListData = res.data;
			changebg(1);
		}
	}).catch(err => {
		console.log("err",err);
	})
};
function dbUpdate(data,img = ''){
	updateDB(db, tableName, {
		id:'localList',
		data:data
	});
	localListData = data;
};
function dbAdd(data){
	addData(db, tableName, {
		id:'localList',
		data:data
	});
};
dbOpen.then(res => {
	db = res;
	dbGet();
}).catch(err => {
	console.log('err',err);
})
//-----------------数据库操作结束-------------------------------
//接受页面请求
chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.action == "change") {
			changebg(0);
            sendResponse({state:'切换成功！'});
        }else if (request.action == "changeimg") {
			changebg(1);
            sendResponse({state:'切换成功！'});
        }else if (request.action == "cancelchange") {
			changebg(3);
            sendResponse({state:'删除背景！'});
        }else if (request.action == "deleteData") {
			let localList = localStorage.getItem('localList');
			localList = (localList == undefined ? [] : JSON.parse(localList));
			let imgSrc = request.data;
			imgSrc = getString(imgSrc);
			for(let i = 0; i < localList.length; i++){
				let src = localList[i];
				src = getString(src);
				if(src == imgSrc){
					localList.splice(i,1);
					break;
				}
			}
			localList = JSON.stringify(localList);
			localStorage.setItem('localList',localList);
			changebg(1);
            sendResponse({state:localList});
        }else if (request.action == "sendData") {
			// let localList = localStorage.getItem('localList');
			// localList = (localList == undefined ? [] : JSON.parse(localList));
			// let rData = JSON.parse(request.data);
			// rData.map(item=>{
			// 	for(let i = 0; i < localList.length; i++){
			// 		if(getImgList(item) == getString(localList[i])){
			// 			break;
			// 		}
			// 		if(i == localList.length - 1){
			// 			localList.push(item);
			// 		}
			// 	}
			// });
			// localList = JSON.stringify(localList);
			// localStorage.setItem('localList',localList);
			// localListData = JSON.parse(request.data);
			// localListData.push();
			// localListData = [... new Set(localListData)];
			let rData = JSON.parse(request.data);
			if(rData !== []){
				localListData = rData;
				dbUpdate(localListData);
			}
			changebg(1);
            sendResponse({state:localListData});
        }else if (request.action == "addImg") {
			let localList = localStorage.getItem('localList');
			localList = (localList == undefined ? [] : JSON.parse(localList));
			let rData = JSON.parse(request.data);
			localList.push(rData);
			localList = JSON.stringify(localList);
			localStorage.setItem('localList',localList);
			changebg(1);
            sendResponse({state:localList});
        }
    }
);
//生成随机数，随机切换图片
function randomNum(min,max){ 
    switch(arguments.length){ 
        case 1: 
            return Math.floor(Math.random()*minNum+1); 
        break; 
        case 2: 
            return Math.floor(Math.random()*(max-min+1)+min); 
        break; 
            default: 
                return 0; 
            break; 
    } 
} 
//顺序切换图片
function byorder(max){ 
     showind = (showind + 1) % max;
	 return showind;
} 
//切换背景
function changebg(ind){
	let img = getImgList();
	let colors = ['#482936','#461629','#35333c','#11659a'];
	let bgimg = [
		...img,
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
	let gdiv = document.getElementById('changdiv');
	let gbody = document.getElementsByTagName('body')[0];
	let gbtn = document.getElementById('gbtn');
	gbody.style.opacity = '0.8';
	isHide = false;
	gbtn.style.display = 'block';
	if(ind == 1){//随机切换图片
		let num = randomNum(0,bgimg.length-1);
		let src = bgimg[num];
		if(Array.isArray(src)){
			src = src.join('');
		}
		gdiv.style.backgroundImage ="url("+src+")";
		gdiv.style.backgroundRepeat = "no-repeat";
		gdiv.style.backgroundSize = "cover";
	}else if(ind == 0){//随机切换背景颜色
		gdiv.style.backgroundImage = "";
		let num = randomNum(0,colors.length-1);
		gdiv.style.backgroundColor = colors[num];
	}else if(ind == 3){//删除背景颜色和背景图片
		gbody.style.opacity = '1';
		gdiv.style.backgroundImage = "";
		gdiv.style.backgroundColor = "";
		gbtn.style.display = 'none';
		isHide = true;
	}else if(ind == 4){//顺序切换背景图片
		let num = byorder(bgimg.length);
		let src = bgimg[num];
		if(Array.isArray(src)){
			src = src.join('');
		}
		gdiv.style.backgroundImage ="url("+src+")";
		gdiv.style.backgroundRepeat = "no-repeat";
		gdiv.style.backgroundSize = "cover";
	}
}
//页面初始化
function init(){
	//生成一个div作为图片容器
	let gbody = document.getElementsByTagName('body')[0];
	gbody.style.opacity = '0.8';
	let ghtml = document.getElementsByTagName('html')[0],
				gdiv = document.createElement('div');
	gdiv.id = 'changdiv';
	gdiv.style.position = 'fixed';
	gdiv.style.width = '100%';
	gdiv.style.height = '100%';
	gdiv.style.top = '0px';
	gdiv.style.left = '0px';
	gdiv.style.opacity = '0.7';
	gdiv.style.zIndex= '-1';
	ghtml.appendChild(gdiv);
	//页面上的切换按钮
	let gbtn = document.createElement('div');
	gbtn.id = 'gbtn';
	gbtn.innerText = "切换图片";
	gbtn.style.opacity = '0.6';
	gbtn.style.position = 'fixed';
	gbtn.style.right = '40px';
	gbtn.style.top = '50%';
	gbtn.style.border = 'solid black 1px'
	gbtn.style.width = '80px';
	gbtn.style.height = '80px';
	gbtn.style.borderRadius = '50% 50%';
	gbtn.style.lineHeight = '80px';
	gbtn.style.textAlign = 'center';
	gbtn.style.backgroundImage = "linear-gradient(#e66465, #9198e5)";
	gbtn.style.fontSize = "initial";
	gbtn.style.cursor = "pointer";
	ghtml.appendChild(gbtn);
	
	$("#gbtn").hover(function(){
		let w = parseInt($("#gbtn").css("left"));
		if(w == windowWidth-20){
			$("#gbtn").css({"left":windowWidth-80});
		}
	},function(){
		let w = parseInt($("#gbtn").css("left"));
		if(w >= windowWidth-80){
			$("#gbtn").css({"left":windowWidth-20});
		}

	});
	
	//按钮拖拽功能
	$("#gbtn").mousedown(function(e){
		gmove=true;
		startX = e.pageX
		startY = e.pageY
		_gx=e.pageX-parseInt($("#gbtn").css("left"));
		_gy=e.pageY-parseInt($("#gbtn").css("top"));
	});
	$(document).mousemove(function(e){
		if(gmove){
			var x=e.pageX-_gx;//控件左上角到屏幕左上角的相对位置
			var y=e.pageY-_gy;
			$("#gbtn").css({"top":y,"left":x});
		}
	}).mouseup(function(e){
		endX = e.pageX;
		endY = e.pageY;
		let d = Math.sqrt((startX - endX) * (startX - endX) + (startY - endY) * (startY - endY));
		if (d === 0 || d < 7) {
			changebg(4);
		} else {
			if(windowWidth - endX < 60){
				$("#gbtn").css({"left":windowWidth-20});
			}
		}
		gmove=false;
	});
}
function keyDown(){
	//ctrlKey（metaKey）、altKey、shiftKey
	$(document).keydown(function(event){
		//alt + z 隐藏显示
		if(event.altKey && event.keyCode==90){
			if(isHide){
				changebg(1);
			}else{
				changebg(3);
			}
		}
		//alt + x 切换图片(可能会被截屏占用快捷键)
		else if(event.altKey && event.keyCode==88){
			if(!isHide){
				changebg(4);
			}
		}
		//alt + w 切换图片
		else if(event.altKey && event.keyCode==87){
			if(!isHide){
				changebg(4);
			}
		}
		//alt + c 切换颜色
		else if(event.altKey && event.keyCode==67){
			if(!isHide){
				changebg(0);
			}
		}
	});
}

init();
changebg(1);
keyDown();


function getImgList(){
	let localList = localListData || [];
	return localList;
}
//数据库
class DataBase{
    constructor(dbConfig){
        for(let key in dbConfig){
            this[key] = dbConfig[key];
        }
    }
    /**
     * 打开数据库
     * @param {object} dbName 数据库的名字
     * @param {string} storeName 仓库名称
     * @param {string} version 数据库的版本
     * @return {object} 该函数会返回一个数据库实例
     */
    openDB(dbName,storeName, version = 1) {
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
            myConsole("数据库打开成功");
            resolve(db);
        };
        // 数据库打开失败的回调
        request.onerror = function (event) {
            myConsole("数据库打开报错");
        };
        // 数据库有更新时候的回调
        request.onupgradeneeded = function (event) {
            // 数据库创建或升级的时候会触发
            myConsole("onupgradeneeded");
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
    addData(db, storeName, data) {
        var request = db
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
    getDataByKey(db, storeName, key) {
        return new Promise((resolve) => {
        var transaction = db.transaction([storeName]); // 事务
        var objectStore = transaction.objectStore(storeName); // 仓库对象
        var request = objectStore.get(key); // 通过主键获取数据
    
        request.onerror = function (event) {
            myConsole("事务失败");
        };
    
        request.onsuccess = function (event) {
            // console.log("主键查询结果: ", request.result);
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
    updateDB(db, storeName, data) {
        var request = db
        .transaction([storeName], "readwrite") // 事务对象
        .objectStore(storeName) // 仓库对象
        .put(data);
    
        request.onsuccess = function () {
        //   console.log("数据更新成功");
        };
    
        request.onerror = function () {
        //   console.log("数据更新失败");
        };
    }
    dbGet(key){
        return this.getDataByKey(db, this.tableName, key);
    };
    dbUpdate(id,data){
        this.updateDB(db, this.tableName, {
            id:id,
            data:data
        });
    };
    dbAdd(data,id){
        this.addData(db, this.tableName, {
            id:id,
            data:data
        });
    };
}
//弹窗
class Dialog {
    constructor(innerHTML){
        this.generatePreviewContent(innerHTML);
        this.isHide = true;

    }
    generatePreviewContent(){
        let ghtml = document.getElementsByTagName('html')[0],
            mask = document.createElement('div'),
            dialog = document.createElement('div');
        mask.id = "mask";
        dialog.id = "dialog";
        let maskStyles = {
            position: "fixed",
            height: '100vh',
            width: '100vw',
            backgroundColor: 'grey',
            top: 0,
            opacity:0.8,
            zIndex:999,
            display:'none'
        };
        let dialogStyles = {
            position: "fixed",
            height: '70vh',
            width: '50vw',
            backgroundColor: 'white',
            top: "10vh",
            left: "25vw",
            zIndex:1000,
            display:"none",
            flexDirection: 'column',
            "background-image": 'url(https://i.loli.net/2021/08/17/J8G3sZNvcEP25XA.gif)',
            "background-size": '100%',
            "background-repeat": 'no-repeat',
            opacity:0.7,
        }
        mask = tagConfingSet(mask,maskStyles);
        dialog = tagConfingSet(dialog,dialogStyles);
        dialog.innerHTML = `
            <div style="height:5%;">
                <span id="dialogCloseBtn" title="关闭" style="color:red;float: right;width: 1rem;height: 1rem;
                            background-color: gainsboro;line-height: 1rem;
                            text-align: center;border-radius: 50%;margin: 0.3rem;
                            cursor: pointer;">
                    x
                </span>
            </div>
            <div style="margin-bottom:0.5rem;text-align: center;font-size: large;">
                GitLab插件面板
            </div>
            <div style="height:100%;padding: 1rem 2rem 1rem 2rem;">
                <div style="display:flex;">
                    <input title="GitLab地址" id="gitLabAddress" style='${this.setStyle('input','flex:4;')}' placeholder="GitLab地址"/>
                    <span id="gitLabAddressResetBtn" style='${this.setStyle('btn','flex:1;')}'>清空</span>
                    <span id="gitLabAddressSaveBtn" style='${this.setStyle('btn','flex:1;')}'>保存</span>
                </div>
                <div style="display:flex;">
                    <input title="项目过滤" id="filterName" style='${this.setStyle('input','flex:4;')}' placeholder="保存默认过滤字段"/>
                    <span id="filterNameResetBtn" style='${this.setStyle('btn','flex:1;')}'>清空</span>
                    <span id="filterNameSaveBtn" style='${this.setStyle('btn','flex:1;')}'>保存</span>
                </div>
            </div>
            <div style="background-color: deepskyblue;display: flex;height:2rem;">
                <div id="dialogDeleteBtn" title="取消" style="flex:1;text-align: center;cursor: pointer;line-height: 2rem;border-right: 1px solid;">取消</div>
                <div id="dialogSetBtn" title="确认" style="flex:1;text-align: center;cursor: pointer;line-height: 2rem;">确认</div>
            </div>
        `
        ghtml.appendChild(dialog);
        $('#dialogCloseBtn').click(()=>{
            this.dialogBtnClick('close');
        })
        $('#dialogDeleteBtn').click(()=>{
            this.dialogBtnClick('delete');
        })
        $('#dialogSetBtn').click(()=>{
            this.dialogBtnClick('set');
        })
        $('#filterNameSaveBtn').click(()=>{
            const filterName = $('#filterName')[0];
            this.dialogBtnClick('filterNameSave',filterName.value);
        })
        $('#filterNameResetBtn').click(()=>{
            $('#filterName')[0].value = '';
            // this.dialogBtnClick('filterNameSave','');
        })
        $('#gitLabAddressSaveBtn').click(()=>{
            const filterName = $('#gitLabAddress')[0];
            this.dialogBtnClick('gitLabAddressSave',filterName.value);
        })
        $('#gitLabAddressResetBtn').click(()=>{
            $('#gitLabAddress')[0].value = '';
            // this.dialogBtnClick('filterNameSave','');
        })
        ghtml.appendChild(mask);
    }
    setStyle(type='',style=''){
        style += 'line-height:2.5rem;height:2.5rem;'
        switch(type){
            case 'btn':
                style += 'background-color: cadetblue;margin-left: 8px;text-align:center;cursor:pointer;'
                break;
            case 'label':
                style += ''
                break;
            case 'input':
                style += ''
                break;
            default:
                break;
        }
        return style;
    }
    dialogBtnClick(method = '',para = ''){
        // if(para != '') para = para.split(',');
        // para = JSON.stringify(para);
        const dialog = document.getElementById('dialog');
        const mask = document.getElementById('mask');
        switch(method){
            case 'close':
                dialog.style.display = 'none';
                mask.style.display = 'none';
                this.isHide = true;
                break;
            case 'set':
                dialog.style.display = 'none';
                mask.style.display = 'none';
                break;
            case 'delete':
                dialog.style.display = 'none';
                mask.style.display = 'none';
                break;
            case 'filterNameSave':
                filterByName(para);
                database.dbUpdate('filterName',para);
                alert("已保存");
                break;
            case 'gitLabAddressSave':
                database.dbUpdate('gitLabAddress',para);
                gitLabAddress = para;
                break;
            default:
                break;
        }
    }
    show(){
        const dialog = document.getElementById('dialog');
        const mask = document.getElementById('mask');
        mask.style.display = 'block';
        dialog.style.display = 'flex';
        this.isHide = false;
    }
    close(){
        this.dialogBtnClick('close');
    }
}
//键盘事件
class KeyFunction{
    constructor(){
        
    }
    altZ(){
        if(inGitLab){
            if(dialog.isHide) dialog.show();
            else dialog.close();
        }else{
            let r = confirm("跳转到GitLab？");
            if (r==true){
                this.openUrl(gitLabAddress,"_blank");
            }else{
                console.log('取消')
            }
        }
    }
    openUrl(url,target){
        window.open(gitLabAddress,target);
    }
}

//发送请求
function sendToBackground(action){
	chrome.runtime.sendMessage({action: action}, function(response) {
		// console.log(response);
	});
};

//接受页面请求
chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
		const action = request.action;
		switch(action){
			default:
				break;
		}
    }
);

//数据库配置信息
const dbConfig = {
    dbName:'GitLabDb', 
    tableName:'GitLabTable'
};
var db;
var inGitLab = false;
var database = new DataBase(dbConfig);
var gitLabAddress = 'http://139.9.65.112/';
var dialog = new Dialog();
var keyFunction = new KeyFunction();
var originDomList;

//是否在gitlab中
if(window.location.href.indexOf(gitLabAddress) > -1){
    inGitLab = true;
    originDomList = document.getElementsByClassName('projects-list')[0].innerHTML;
    let dbOpen = database.openDB(dbConfig.dbName,dbConfig.tableName);
    dbOpen.then(res => {
        db = res;
        initData();
    }).catch(err => {
        console.log('err',err);
    })
}
//初始化页面数据
function initData() {
    let filterName = database.dbGet('filterName');
    filterName.then(res=>{
        $('#filterName')[0].value = res.data;
        filterByName(res.data);
    }).catch(err=>{
        console.log(err);
    })
}
//页面过滤
function filterByName(filterName){
    document.getElementsByClassName('projects-list')[0].innerHTML = originDomList;
    filterName = filterName.split('、');
    let domList = document.getElementsByClassName('project-row');
    for(let i = 0;domList && i < domList.length; i++){
        const item = domList[i];
        const dom = item.getElementsByClassName('description');
        const text = dom[0].innerText;
        let flag = true;
        for(let j = 0; j < filterName.length; j++){
            const name = filterName[j];
            if(text.indexOf(name) != -1){
                flag = false;
                break;
            }
        }
        if(flag){
            item.remove();
            i--;
        }
    }
}
//页面初始化
function init(){

}

function keyDown(){
	$(document).keydown(function(event){
		//alt + z
		if(event.altKey && event.keyCode==86){
            keyFunction.altZ();
		}
	});
}
init();
keyDown();
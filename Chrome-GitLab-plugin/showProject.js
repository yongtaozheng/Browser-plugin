//弹窗
class Dialog {
    constructor(innerHTML){
        this.generatePreviewContent(innerHTML);
        this.isHide = true;
    }
    //创建弹窗
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
            "background-image": 'url(' + pageConfig.backgroundImg + ')',
            "background-size": '100%',
            "background-repeat": 'no-repeat',
            opacity:0.7,
        }
        mask = tagConfingSet(mask,maskStyles);
        dialog = tagConfingSet(dialog,dialogStyles);
        dialog.innerHTML = `
            <div style="height:5%;font-size: 16px;">
                <span id="dialogCloseBtn" title="关闭" style="color:red;float: right;width: 16px;height: 16px;
                            background-color: gainsboro;line-height: 16px;
                            text-align: center;border-radius: 50%;margin: 4.8px;
                            cursor: pointer;font-size: 16px;">
                    x
                </span>
            </div>
            <div style="margin-bottom:8px;text-align: center;font-size: large;">
                Chrome便捷助手
            </div>
            <div style="height:100%;padding: 16px 32px 16px 32px;font-size: 16px;">
                <input placeholder="按tab键可自动补全，输入关键字按回车" id="dialogSearchInput" style="width:100%;line-height:48px;height:48px;"/>
                <div id="searchTip" style="word-break:break-all;width:100%;color:red;text-align:center;"></div>
                <div style="display:flex;margin-top:16px;">
                    <div style='${this.setStyle('','flex:4;display:flex;')}'>
                        <span style="${this.setStyle('label','width:30%;')}">项目关键字</span>
                        <input title="项目过滤" id="filterName" style='${this.setStyle('input','width:80%;')}' placeholder="保存默认过滤字段"/>
                    </div>
                    <span id="filterNameResetBtn" style='${this.setStyle('btn','flex:1;')}'>清空</span>
                    <span id="filterNameSaveBtn" style='${this.setStyle('btn','flex:1;')}'>保存</span>
                </div>
                <div style="display:flex;margin-top:16px;">
                    <div style='${this.setStyle('','flex:4;display:flex;')}'>
                        <input title="屏幕1" id="splitUrl1" style='${this.setStyle('input','width:45%;')}' placeholder="屏幕1URL"/>
                        <input title="屏幕2" id="splitUrl2" style='${this.setStyle('input','margin-left:5%;width:45%;')}' placeholder="屏幕2URL"/>
                    </div>
                    <span id="splitBoard" style='${this.setStyle('btn','flex:1;')}'>分屏</span>
                </div>
            </div>
            <div style="background-color: deepskyblue;display: flex;height:32px;font-size: 16px;">
                <div id="dialogDeleteBtn" title="取消" style="flex:1;text-align: center;cursor: pointer;line-height: 32px;border-right: 1px solid;">取消</div>
                <div id="dialogSetBtn" title="确认" style="flex:1;text-align: center;cursor: pointer;line-height: 32px;">确认</div>
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
        })
        $('#splitBoard').click(()=>{
            let splitUrl1 = $('#splitUrl1')[0].value;
            let splitUrl2 = $('#splitUrl2')[0].value;
            if(splitUrl1 != '' && splitUrl2 != ''){
                this.dialogBtnClick('splitBoard',[splitUrl1,splitUrl2]);
            }
        })
        let searchInput = $('#dialogSearchInput')[0];
        let searchTip = $('#searchTip')[0];
        //获取当前快捷键跳转地址
        searchInput.oninput = function(){
            let val = searchInput.value.trim();
            let tip = '';
            let append = '本窗口打开:';
            if(val.length == 0) searchTip.innerText = searchConfig.baseUrl;
            else{
                val = val.split(' ');
            }
            if(val.length > 1){
                if(val[1].length > 0){
                    append = "新窗口打开:";
                }
            }
            tip = searchConfig[val[0]] || "";
            if(tip !== "") tip = append + tip;
            searchTip.innerText = tip;
        };
        ghtml.appendChild(mask);
    }
    setStyle(type='',style=''){
        if(style != 'tip') style += 'line-height:40px;height:40px;'
        switch(type){
            case 'btn':
                style += 'background-color: cadetblue;margin-left: 8px;text-align:center;cursor:pointer;'
                break;
            case 'label':
                style += 'background-color:white;text-align:center;border-radius: 5px;'
                break;
            case 'input':
                style += ''
                break;
            case 'tip':
                style += 'color:red;text-align:center;';
                break;
            default:
                break;
        }
        return style;
    }
    dialogBtnClick(method = '',para = ''){
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
            case 'splitBoard':
                splitScreen(para[0],para[1]);
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
        let selectInput = document.getElementById('dialogSearchInput');
        selectInput.focus();
        $('#searchTip')[0].innerText = '本窗口打开:' + searchConfig.baseUrl;
        $('#splitUrl1')[0].value = location.href;
        $('#splitUrl2')[0].value = location.href;
    }
    close(){
        this.dialogBtnClick('close');
    }
}
//键盘事件
class KeyFunction{
    constructor(){
        
    }
    openPanel(){
        if(dialog.isHide) dialog.show();
        else dialog.close();
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
var gitLabAddress = searchConfig.baseUrl;
var dialog = new Dialog();
var keyFunction = new KeyFunction();
var originDomList;

//是否在gitlab中
if(window.location.href == gitLabAddress){
    inGitLab = true;
    originDomList = document.getElementsByClassName('projects-list')[0].innerHTML;
    let dbOpen = database.openDB(dbConfig.dbName,dbConfig.tableName);
    dbOpen.then(res => {
        db = res;
        database.setDb(db);
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
//页面分屏
function splitScreen(url1,url2){
    document.write('<HTML><HEAD></HEAD><FRAMESET COLS=\'50%25,*\'><FRAME SRC=' + url1 + '><FRAME SRC=' + url2 + '></FRAMESET></HTML>')
}
//页面初始化
function init(){

}
//监听键盘事件
function keyDown(){
	$(document).keydown(function(event){
		if(event.keyCode==9){
            let searchInput = $('#dialogSearchInput')[0];
            let searchTip = $('#searchTip')[0];
            for(let key in searchConfig){
                if(key.length >= searchInput.value.length && searchInput.value == key.slice(0,searchInput.value.length)){
                    searchInput.value = key;
                    searchTip.innerText = '本窗口打开:' + searchConfig[key];
                }
            }
            return false;
        }else if(isOpenKey(event)){
            keyFunction.openPanel();
		}else if(event.keyCode == 13){
            if(!dialog.isHide && event.target.id=='dialogSearchInput'){
                dialogSearch(event.target.value);
            }
        }
	});
}
//判断是否打开面板快捷键
function isOpenKey(e){
    const openKey = shortcutsKeys.open;
    for(let key in openKey){
        if(e[key] != openKey[key]){
            return false;
        }
    }
    return true;
}
function dialogSearch(para){
    para = para.trim().split(' ');
    let target = para[0];
    let type = "_self";
    if(para.length > 1 && para[1].length > 0) type = '_blank';
    if(target == '') target = 'baseUrl';
    let tar = searchConfig[target] || '';
    if(tar != ''){
        if(tar !== 'null') window.open(tar,type);
    }else{
        alert("未定义该关键字");
    }
}
init();
keyDown();
let innerHtml = `
    <div style="margin-bottom:8px;text-align: center;font-size: large;">
        Chrome便捷助手
    </div>
    <div style="height:100%;padding: 16px 32px 16px 32px;font-size: 16px;">
        <input placeholder="按tab键可自动补全，输入关键字按回车" id="dialogSearchInput" class="dialogSearchInput" style="width:100%;line-height:48px;height:48px;"/>
        <div class="searchTip" style="word-break:break-all;width:100%;color:red;text-align:center;"></div>
        <div style="display:flex;margin-top:16px;">
            <div style='${this.setStyle('','flex:4;display:flex;')}'>
                <span style="${this.setStyle('label','width:30%;')}">项目关键字</span>
                <input title="项目过滤" class="filterName" style='${this.setStyle('input','width:80%;')}' placeholder="保存默认过滤字段"/>
            </div>
            <span class="filterNameResetBtn" style='${this.setStyle('btn','flex:1;')}'>清空</span>
            <span class="filterNameSaveBtn" style='${this.setStyle('btn','flex:1;')}'>保存</span>
        </div>
        <div style="display:flex;margin-top:16px;">
            <div style='${this.setStyle('','flex:4;display:flex;')}'>
                <input title="屏幕1" class="splitUrl1" style='${this.setStyle('input','width:45%;')}' placeholder="屏幕1URL"/>
                <input title="屏幕2" class="splitUrl2" style='${this.setStyle('input','margin-left:5%;width:45%;')}' placeholder="屏幕2URL"/>
            </div>
            <span class="splitBoard" style='${this.setStyle('btn','flex:1;')}'>分屏</span>
        </div>
    </div>
    <div style="background-color: deepskyblue;display: flex;height:32px;font-size: 16px;">
        <div class="dialogDeleteBtn" title="取消" style="flex:1;text-align: center;cursor: pointer;line-height: 32px;border-right: 1px solid;">取消</div>
        <div class="dialogSetBtn" title="确认" style="flex:1;text-align: center;cursor: pointer;line-height: 32px;">确认</div>
    </div>
    `;

var panel = new Dialog(innerHtml);
let panelDom = document.getElementById(panel.dialogId);
let searchInput = panelDom.getElementsByClassName('dialogSearchInput')[0];
let searchTip = panelDom.getElementsByClassName('searchTip')[0];

panelDom.getElementsByClassName('dialogDeleteBtn')[0].onclick = ()=>{
    panel.close();
};
panelDom.getElementsByClassName('dialogSetBtn')[0].onclick = ()=>{
    panel.close();
};
panelDom.getElementsByClassName('filterNameSaveBtn')[0].onclick = ()=>{
    const filterName = panelDom.getElementsByClassName('filterName')[0].value;
    filterByName(filterName);
    database.dbUpdate('filterName',filterName);
    alert("已保存");
};
panelDom.getElementsByClassName('filterNameResetBtn')[0].onclick = ()=>{
    panelDom.getElementsByClassName('filterName')[0].value = '';
};
panelDom.getElementsByClassName('splitBoard')[0].onclick = ()=>{
    let url1 = panelDom.getElementsByClassName('splitUrl1')[0].value;
    let url2 = panelDom.getElementsByClassName('splitUrl2')[0].value;
    if(url1 != '' && url2 != ''){
        document.write('<HTML><HEAD></HEAD><FRAMESET COLS=\'50%25,*\'><FRAME SRC=' + url1 + '><FRAME SRC=' + url2 + '></FRAMESET></HTML>');
    }
};
//获取当前快捷键跳转地址
searchInput.oninput = function(){
    let val = replaceSpace2One(searchInput.value.trim());
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

//数据库配置信息
const dbConfig = {
    dbName:'GitLabDb', 
    tableName:'GitLabTable'
};
var database = new DataBase(dbConfig);

//是否在gitlab中
if(window.location.href == searchConfig.baseUrl){
    var inGitLab = true;
    var originDomList = document.getElementsByClassName('projects-list')[0].innerHTML;
    let dbOpen = database.openDB(dbConfig.dbName,dbConfig.tableName);
    dbOpen.then(res => {
        database.setDb(res);
        initData();
    }).catch(err => {
        console.log('err',err);
    })
}
keyDown();

//初始化页面数据
function initData() {
    let filterName = database.dbGet('filterName');
    filterName.then(res=>{
        panelDom.getElementsByClassName('filterName')[0].value = res.data;
        filterByName(res.data);
    }).catch(err=>{
        console.log(err);
    })
}
//监听键盘事件
function keyDown(){
	panelDom.onkeydown = function(event){
		if(event.keyCode==9){
            for(let key in searchConfig){
                if(key.length >= searchInput.value.length && searchInput.value == key.slice(0,searchInput.value.length)){
                    searchInput.value = key;
                    searchTip.innerText = '本窗口打开:' + searchConfig[key];
                }
            }
            return false;
        }else if(event.keyCode == 13){
            if(!panel.isHide && event.target.id=='dialogSearchInput'){
                dialogSearch(event.target.value);
            }
        }
	};
    $(document).keydown(function(event){
		if(isOpenKey(event)){
            openPanel();
		}
	});
}
function openPanel(){
    if(panel.isHide) {
        panel.open();
        searchInput.focus();
        let url1 = panelDom.getElementsByClassName('splitUrl1')[0];
        let url2 = panelDom.getElementsByClassName('splitUrl2')[0];
        searchTip.innerText = '本窗口打开:' + searchConfig.baseUrl;
        url1.value = location.href;
        url2.value = location.href;
    }
    else panel.close();
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

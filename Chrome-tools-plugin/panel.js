let innerHtml = `
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
    `;
function callBack(){
    
}
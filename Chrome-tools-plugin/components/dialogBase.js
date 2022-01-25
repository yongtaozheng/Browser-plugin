/*
 * @Author: zheng yong tao
 * @Date: 2021-12-30 00:51:37
 * @LastEditors: zheng yong tao
 * @LastEditTime: 2021-12-30 02:21:36
 * @Description: "弹窗组件类封装"
 */
class Dialog {
    /**
     * 
     * @param {String} innerHTML 内嵌页面html
     * @param {Object} config  弹窗属性配置
     * @param {Function} callBack 回调函数
     * @param {Number} mode 内嵌模式 -> 1:页面初始化时就创建dom元素并插入页面 2：窗口打开是创建dom元素，关闭时销毁
     */
    constructor(innerHTML,config = {},callBack,mode = 1){
        this.config = config;
        this.mode = mode;
        this.callBack = callBack
        this.innerHTML = innerHTML;
        this.maskId = 'mask-mt';
        this.dialogInit();
        this.generateMask();
        this.generatePreviewContent(innerHTML);
        if(mode == 1){
            this.append();
        }
    }
    //初始化配置信息
    dialogInit(){
        const dialog = document.getElementsByClassName('dialog');
        let dialogId = 'dialog';
        if(dialog) dialogId += "-" + dialog.length;
        this.dialogId = dialogId;
        this.isHide = true;
    }
    //创建遮罩
    generateMask(){
        let mask = document.createElement('div');
        const maskT = document.getElementsByClassName('mask-mt');
        if(maskT && maskT.length > 0) mask = maskT[0];
        else{
            mask.className = "mask-mt";
            mask.id = this.maskId;
            let maskStyles = {
                position: "fixed",
                height: '100vh',
                width: '100vw',
                backgroundColor: 'grey',
                top: 0,
                opacity:0.8,
                zIndex:2147483646,
                display:'none'
            };
            mask = tagConfingSet(mask,maskStyles);
        }
        this.mask = mask;
    }
    //创建弹窗
    generatePreviewContent(innerHTML){
        let dialog = document.createElement('div');
        dialog.className = "dialog";
        dialog.id = this.dialogId;
        let dialogStyles = {
            position: "fixed",
            height: this.config.height || '70vh',
            width: this.config.width || '50vw',
            backgroundColor: 'white',
            top: this.config.top || "10vh",
            left: this.config.left || "25vw",
            zIndex:2147483647,
            display:"none",
            flexDirection: 'column',
            "background-image": 'url(' + this.config.backgroundImg + ')',
            "background-size": '100%',
            "background-repeat": 'no-repeat',
            opacity:0.7,
        }
        dialog = tagConfingSet(dialog,dialogStyles);
        let icon = `
            <div style="height:16px%;font-size: 16px;">
                <span class="dialogCloseBtn" title="关闭" style="color:red;float: right;width: 16px;height: 16px;
                            background-color: gainsboro;line-height: 16px;
                            text-align: center;border-radius: 50%;margin: 4.8px;
                            cursor: pointer;font-size: 16px;">
                    x
                </span>
            </div>
        `;
        dialog.innerHTML = icon + innerHTML;
        let closebtn = dialog.getElementsByClassName('dialogCloseBtn')[0];
        closebtn.onclick = ()=>{
            this.close();
        };
        this.dialog = dialog;
    }
    //将节点插入页面html
    append(){
        let ghtml = document.getElementsByTagName('html')[0];
        ghtml.appendChild(this.dialog);
        ghtml.appendChild(this.mask);
    }
    open(){
        this.mask.style.display = 'block';
        this.dialog.style.display = 'flex';
        this.isHide = false;
        if(this.mode == 2){
            this.append();
            this.callBack();
        }
    }
    close(){
        this.dialog.style.display = 'none';
        this.mask.style.display = 'none';
        this.isHide = true;
        if(this.mode == 2){
            this.dialog.remove();
        }
    }
}

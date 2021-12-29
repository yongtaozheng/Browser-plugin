/*
 * @Author: zheng yong tao
 * @Date: 2021-12-30 00:51:37
 * @LastEditors: zheng yong tao
 * @LastEditTime: 2021-12-30 02:21:36
 * @Description: "弹窗组件类封装"
 */
class Dialog {
    constructor(innerHTML){
        this.dialogInit();
        this.generatePreviewContent(innerHTML);
    }
    //初始化配置信息
    dialogInit(){
        const mask = document.getElementsByClassName('mask');
        const dialog = document.getElementsByClassName('dialog');
        let maskId = 'mask';
        let dialogId = 'dialog';
        if(mask) maskId += "-" + mask.length;
        if(dialog) dialogId += "-" + dialog.length;
        this.maskId = maskId;
        this.dialogId = dialogId;
        this.isHide = true;
    }
    //创建弹窗
    generatePreviewContent(innerHTML){
        let ghtml = document.getElementsByTagName('html')[0],
            mask = document.createElement('div'),
            dialog = document.createElement('div');
        mask.className = "mask";
        dialog.className = "dialog";
        mask.id = this.maskId;
        dialog.id = this.dialogId;
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
        ghtml.appendChild(dialog);
        ghtml.appendChild(mask);
        let closebtn = dialog.getElementsByClassName('dialogCloseBtn')[0];
        closebtn.onclick = ()=>{
            this.close();
        };
        this.dialog = dialog;
        this.mask = mask;
    }
    open(){
        this.mask.style.display = 'block';
        this.dialog.style.display = 'flex';
        this.isHide = false;
    }
    close(){
        this.dialog.style.display = 'none';
        this.mask.style.display = 'none';
        this.isHide = true;
    }
}
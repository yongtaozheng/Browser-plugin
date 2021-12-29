class Dialog {
    constructor(innerHTML){
        this.dialogInit();
        this.generatePreviewContent(innerHTML);
    }
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
        dialog.innerHTML = innerHTML;
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
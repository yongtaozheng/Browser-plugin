$(function(){
	$('#dialogCloseBtn').click(function(){
		dialogBtnClick('close');
	})
	$('#dialogDeleteBtn').click(function(){
		dialogBtnClick('delete');
	})
	$('#dialogSetBtn').click(function(){
		dialogBtnClick('set');
	})
    //弹窗按钮事件
    function dialogBtnClick(method = ''){
        const dialog = document.getElementById('dialog');
        const mask = document.getElementById('mask');
        switch(method){
            case 'close':
                break;
            case 'set':
                dialogSetImg();
                break;
            case 'delete':
                dialogDeleteImg();
                break;
            default:
                break;
        }
        dialog.style.display = 'none';
        mask.style.display = 'none';
    }
});
var showInd;

function dialogDeleteImg(){
    deleteImg(showInd);
};
function dialogSetImg(){
    setShowImg(showInd);
};
//图片预览
function dialogShowImg(){
    showInd = parseInt(this.getAttribute('data-ind'));
    const dialog = document.getElementById('dialog');
    const mask = document.getElementById('mask');
    const showImg = document.getElementById('showImg');
    showImg.src = this.getAttribute('src');
    mask.style.display = 'block';
    dialog.style.display = 'flex';
};
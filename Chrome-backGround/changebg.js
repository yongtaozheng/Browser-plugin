var showind = 0;
var gmove=false;
var startX;
var startY;
var endX;
var endY;
var _gx,_gy;
var windowWidth = window.innerWidth;
var isHide = false;
//接受页面请求
chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.action == "change") {
			changebg(0);
            sendResponse({state:'切换成功！'});
        }
        if (request.action == "changeimg") {
			changebg(1);
            sendResponse({state:'切换成功！'});
        }
        if (request.action == "cancelchange") {
			changebg(3);
            sendResponse({state:'删除背景！'});
        }
        if (request.action == "sendData") {
			let localList = localStorage.getItem('localList');
			localList = (localList == undefined ? [] : JSON.parse(localList));
			console.log('localList',localList);
			let rData = JSON.parse(request.data);
			console.log('rData',rData);
			rData.map(item=>{
				localList.push(rData);
			});
			localList = [... new Set(localList)];
			console.log('localList',localList);
			localList = JSON.stringify(localList);
			localStorage.setItem('localList',localList);
			console.log('sendData',localList);
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
	console.log('img',img);
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
		gdiv.style.backgroundImage ="url("+bgimg[num]+")";
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
		gdiv.style.backgroundImage ="url("+bgimg[num]+")";
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
		// console.log("move",gmove);
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
			// console.log("执行了点击事件");
			changebg(4);
		} else {
			// console.log("执行了拖拽事件");
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
				changebg(1);
			}
		}
		//alt + w 切换图片
		else if(event.altKey && event.keyCode==87){
			if(!isHide){
				changebg(1);
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
	let localList = localStorage.getItem('localList');
	localList = localList ? JSON.parse(localList) : [];
	return localList;
}
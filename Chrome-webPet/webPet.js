let imglist = [
	"https://vkceyugu.cdn.bspapp.com/VKCEYUGU-b06b1ef6-bb41-4224-9b73-8d3e34b7ed2f/d1a674bf-3374-49f6-a2fc-1598e5c22fb4.png",
	"https://vkceyugu.cdn.bspapp.com/VKCEYUGU-b06b1ef6-bb41-4224-9b73-8d3e34b7ed2f/d8ba8a51-1994-40f7-8eac-9b6dab45dc68.png",
	"https://vkceyugu.cdn.bspapp.com/VKCEYUGU-b06b1ef6-bb41-4224-9b73-8d3e34b7ed2f/5a8ac4a2-05a8-4fcb-9207-5b2f21f2be94.png",
	"https://vkceyugu.cdn.bspapp.com/VKCEYUGU-b06b1ef6-bb41-4224-9b73-8d3e34b7ed2f/ae03fab6-cb00-421b-bb74-83279fddf16d.png",
	"https://vkceyugu.cdn.bspapp.com/VKCEYUGU-b06b1ef6-bb41-4224-9b73-8d3e34b7ed2f/3c911ff3-ea69-408f-92cf-91aacd3d41cd.png",
	"https://vkceyugu.cdn.bspapp.com/VKCEYUGU-b06b1ef6-bb41-4224-9b73-8d3e34b7ed2f/b9ba30b2-6c3a-4b40-9f0a-636aafb8c3e7.png",
	"https://vkceyugu.cdn.bspapp.com/VKCEYUGU-b06b1ef6-bb41-4224-9b73-8d3e34b7ed2f/492ddfb1-a25d-47ea-aafe-ff6ceb2ffbc3.png",
	"https://vkceyugu.cdn.bspapp.com/VKCEYUGU-b06b1ef6-bb41-4224-9b73-8d3e34b7ed2f/4a5d7408-801b-419c-9afa-2e716d8d4db3.png",
	"https://vkceyugu.cdn.bspapp.com/VKCEYUGU-b06b1ef6-bb41-4224-9b73-8d3e34b7ed2f/8b23a55a-306c-4ab9-a304-2e66bd71f0fe.png",
	"https://vkceyugu.cdn.bspapp.com/VKCEYUGU-b06b1ef6-bb41-4224-9b73-8d3e34b7ed2f/21df1eea-34b8-4f5a-8bdd-c74943782374.png"
];
let body = document.getElementsByTagName('body')[0];
let myimgbox = document.createElement('div');
myimgbox.id = 'myimgbox';
myimgbox.style.position = 'fixed';
myimgbox.style.right = '40px';
myimgbox.style.top = '50%';
myimgbox.style.opacity = '0.9';
myimgbox.style.zIndex = 1000;
body.appendChild(myimgbox);
var html="";
function changeimg(i,min,max,file){
	html ='<img id = "mypet" style="width:250px !important;heigth:134px !important;" src="' + imglist[i] + '"/>';
	document.getElementById("myimgbox").innerHTML=html;
	// console.log(html);
	if(i < max){
		i++;
	}else{
		i = min;
	}
	setTimeout(function(){
		changeimg(i,min,max,file)
	},200);
}
changeimg(0,0,imglist.length-1,"水门");

var gmove=false;
var startX
var startY
var endX
var endY
var _gx,_gy;

//按钮拖拽功能
$("#myimgbox").mousedown(function(e){
	gmove=true;
	startX = e.pageX
	startY = e.pageY
	console.log("move",gmove);
	_gx=e.pageX-parseInt($("#myimgbox").css("left"));
	_gy=e.pageY-parseInt($("#myimgbox").css("top"));
});
$(document).mousemove(function(e){
	if(gmove){
		var x=e.pageX-_gx;//控件左上角到屏幕左上角的相对位置
		var y=e.pageY-_gy;
		$("#myimgbox").css({"top":y,"left":x});
		console.log("移动");
	}
}).mouseup(function(e){
	endX = e.pageX;
	endY = e.pageY;
	let d = Math.sqrt((startX - endX) * (startX - endX) + (startY - endY) * (startY - endY));
	console.log("d:",d);
	if (d === 0 || d < 7) {
		console.log("执行了点击事件");
		// changebg(4);
	} else {
		console.log("执行了拖拽事件");
	}
	gmove=false;
});
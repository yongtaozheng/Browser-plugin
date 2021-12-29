//自定义打印样式
function myConsole(str){
	console.log(
		`%c JYeontu %c GitLab插件 %c ${str} %c`,
		'background:deepskyblue ; padding: 2px; border-radius: 3px 0 0 3px;  color: #fff',
		'background:skyblue ; padding: 2px; border-radius: 3px 0 0 3px;  color: #fff',
		'background:pink ; padding: 2px; border-radius: 0 3px 3px 0;  color: #fff',
		'background:transparent'
	);
};

//设置style
function tagConfingSet(el,config){
	for(let key in config){
		el.style[key] = config[key];
	}
	return el;
};

//数组转字符串
const getString = function(data){
	if(Array.isArray(data)) return data.join('');
	return data;
};
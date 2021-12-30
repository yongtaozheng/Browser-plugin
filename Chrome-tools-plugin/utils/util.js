/**
 * @author zheng yong tao
 * @param {String} str 打印字符串
 * @description 自定义打印样式
 */
function myConsole(str){
	console.log(
		`%c JYeontu %c Chrome助手 %c ${str} %c`,
		'background:deepskyblue ; padding: 2px; border-radius: 3px 0 0 3px;  color: #fff',
		'background:skyblue ; padding: 2px; border-radius: 3px 0 0 3px;  color: #fff',
		'background:pink ; padding: 2px; border-radius: 0 3px 3px 0;  color: #fff',
		'background:transparent'
	);
};

/**
 * @author zheng yong tao
 * @param {Dom} el dom节点
 * @param {Object} config style配置
 * @description 解析对象数据设置style
 */
function tagConfingSet(el,config){
	for(let key in config){
		el.style[key] = config[key];
	}
	return el;
};

/**
 * @author zheng yong tao
 * @param {String} type 对象类型
 * @param {String} style 附加样式
 * @description 获取定义好的对应样式
 */
function setStyle(type='',style=''){
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
};

/**
 * @author zheng yong tao
 * @param {String|Array} data 需要转换的数据
 * @description 数组转字符串 
 */
function getString(data){
	if(Array.isArray(data)) return data.join('');
	return data;
};

/**
 * @author zheng yong tao
 * @param {String} str 需要转换的字符串
 * @description 多个空格替换成一个空格
 */
function replaceSpace2One(str){
	str = str.replace(/ +/g,' ');
	return str;
} ;
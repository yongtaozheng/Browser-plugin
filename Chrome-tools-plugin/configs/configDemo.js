/*
 * @Author: zheng yong tao
 * @Date: 2021-12-30 21:59:16
 * @LastEditors: zheng yong tao
 * @LastEditTime: 2022-01-08 23:52:56
 * @Description: 
 */
//复制一份到当前目录，并更改文件名为config.js,修改对应配置
//输入框快捷跳转配置
var searchConfig = {
    baseUrl:"http://139.9.65.112/",//搜索框为空时跳转
    jindubiao:'https://docs.qq.com/sheet/DRURld0tud3p5SnpH?tab=cq2xur&groupUin=LrppjvIiADVhgcqHcf7pGQ%25253D%25253D&ADUIN=1311395125&ADSESSION=1633741591&ADTAG=CLIENT.QQ.5833_.0&ADPUBNO=27165',
    kanban:'https://www.mastercom.cn/kanban/list',
    mtoa:'https://www.mastercom.cn/mtex/home/index',
    leetcode:'https://leetcode-cn.com/problemset/all/',
    yuque:'https://www.yuque.com/dashboard',
    jenkins:'http://21.jenkins.frp.mastercom.top/view/H5/job/广东掌上运维-lerna/',
    yapi:'http://193.112.218.97:3000/project/28/interface/api',
	mr:"http://139.9.65.112/webapp/guangdong-palm-ops/-/merge_requests/new",
}
//快速打开面板关键字
var openPenalKeys = {
    解密:"打开解密面板",
    翻译:"打开翻译面板"
}
//全局快捷键配置
var shortcutsKeys = {
    //打开面板
    open:{//默认alt+z
        ctrlKey:false,//是否按住ctrl
        altKey:true,//是否按住alt
        shiftKey:false,//是否按住shift
        keyCode:keyBoardKeyConfig['v']//其他键
    },
    //打开翻译面板
    translationOpen:{
        ctrlKey:false,//是否按住ctrl
        altKey:true,//是否按住alt
        shiftKey:false,//是否按住shift
        keyCode:keyBoardKeyConfig['q']//其他键
    }
}

//面板样式配置
var panelConfig = {
    backgroundImg:'https://i.loli.net/2021/08/17/J8G3sZNvcEP25XA.gif',//面板背景图，支持base64或在线链接
    autocomplete:true,//是否开启搜索框历史输入提示
}
//翻译面板配置
var translationConfig = {
    src:'https://fanyi.qq.com/',//翻译源  https://www.iciba.com/fy -> 无法自动检测语言
}
//加密面板配置
var secretConfig = {
    key:'{jyeontuzz}66688',//十六位十六进制数作为密钥
    iv:'6666668888886666',//十六位十六进制数作为密钥偏移量
    keyDES:'jyeontu1',
    ivDES:'66668888'
}
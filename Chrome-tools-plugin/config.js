//输入框快捷跳转配置
var searchConfig = {
    baseUrl:"http://139.9.65.112/",
    issues:"http://139.9.65.112/webapp/guangdong-palm-ops/-/issues",
    mr:"http://139.9.65.112/webapp/guangdong-palm-ops/-/merge_requests/new",
    jenkins:"http://21.jenkins.frp.mastercom.top/view/H5/job/广东掌上运维-lerna/",
    csdn:"https://blog.csdn.net/Twinkle_sone?spm=1001.2100.3001.5343",
    jindu:"https://docs.qq.com/sheet/DRURld0tud3p5SnpH?tab=cq2xur&groupUin=LrppjvIiADVhgcqHcf7pGQ%25253D%25253D&ADUIN=1311395125&ADSESSION=1633741591&ADTAG=CLIENT.QQ.5833_.0&ADPUBNO=27165",
    gitee:"https://gitee.com/",
    juejin:"https://juejin.cn/",
    kanban:"https://www.mastercom.cn/kanban/board/971",
    leetcode:"https://leetcode-cn.com/problemset/all/",
    mtoa:"https://www.mastercom.cn/mtex/home/index",
    yapi:"http://193.112.218.97:3000/project/28/interface/api"
}
//全局快捷键配置
var shortcutsKeys = {
    //打开面板
    open:{//默认alt+z
        ctrlKey:false,//是否按住ctrl
        altKey:true,//是否按住alt
        shiftKey:false,//是否按住shift
        keyCode:keyBoardKeyConfig['v']//其他键
    }
}
//页面样式配置
var pageConfig = {
    //base64或在线链接
    backgroundImg:'https://i.loli.net/2021/08/17/J8G3sZNvcEP25XA.gif'
}

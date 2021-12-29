//输入框快捷跳转配置
var searchConfig = {
    baseUrl:"https://gitee.com/",//搜索框为空时跳转
    csdn:"https://blog.csdn.net/Twinkle_sone?spm=1001.2100.3001.5343",
    gitee:"https://gitee.com/",
    juejin:"https://juejin.cn/",
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

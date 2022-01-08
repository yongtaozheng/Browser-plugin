/*
 * @Author: zheng yong tao
 * @Date: 2021-12-30 21:59:16
 * @LastEditors: zheng yong tao
 * @LastEditTime: 2022-01-09 00:44:07
 * @Description: 
 */
$(function(){
    var state = $('#state');
    $('#change').click(function () {
        chrome.tabs.query({active:true, currentWindow:true}, function (tab) {
            chrome.tabs.sendMessage(tab[0].id, {  
               action: "change"   
            }, function (response) {
                state.html(response.state)
            });
        });
    })
    $('#changeimg').click(function () {
        chrome.tabs.query({active:true, currentWindow:true}, function (tab) {
            chrome.tabs.sendMessage(tab[0].id, {  
               action: "changeimg"   
            }, function (response) {
                state.html(response.state)
            });
        });
    })
    $('#cancelchange').click(function () {
        chrome.tabs.query({active:true, currentWindow:true}, function (tab) {
            chrome.tabs.sendMessage(tab[0].id, {  
               action: "cancelchange"   
            }, function (response) {
                state.html(response.state)
            });
        });
    })
})
/**
 * 
        ctrlKey:false,//是否按住ctrl
        altKey:true,//是否按住alt
        shiftKey:false,//是否按住shift
        keyCode:keyBoardKeyConfig['v']//其他键
 */
let dom = document.getElementById('fastKeys');
const getKeyByValue = function(val){
    for(let key in keyBoardKeyConfig){
        if(keyBoardKeyConfig[key] == val) return key;
    }
    return '';
};
const getKeys = function(obj){
    let res = [];
    console.log(obj);
    if(obj.ctrlKey) res.push('ctrl');
    if(obj.shiftKey) res.push('shift');
    if(obj.altKey) res.push('alt');
    res.push(getKeyByValue(obj.keyCode));
    return res.join(' + ');
};
let fastKeysInnerHtml = `<div style="text-align: center;">快捷键说明</div>`;
for(let key in shortcutsKeys){
    fastKeysInnerHtml += `<div>${getKeys(shortcutsKeys[key].fastKeyCode)}：${shortcutsKeys[key].descript}</div>`
}
dom.innerHTML = fastKeysInnerHtml;
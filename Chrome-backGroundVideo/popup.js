$(function(){
    var state = $('#state');
    $('#changeBgVideo').click(function () {
        mess($('#iframeSrc').val());
    })
    async function mess (val) {
        const tabId = await getCurrentTabId()
        const connect = chrome.tabs.connect(tabId, {name: 'myConnect'});
        console.log('111',connect)
        connect.postMessage(val)
        connect.onMessage.addListener((mess) => {
            console.log('mess',mess)
        })
    }

    /**
     * 获取当前 tab ID
     */
    function getCurrentTabId() {
        return new Promise((resolve, reject) => {
            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                resolve(tabs.length ? tabs[0].id : null)
            });
        })
    }
})

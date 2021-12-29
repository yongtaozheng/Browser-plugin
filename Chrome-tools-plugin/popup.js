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
//发送请求
function sendToBackground(action){
	chrome.runtime.sendMessage({action: action}, function(response) {
		// console.log(response);
	});
};

//接受页面请求
chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
		const action = request.action;
		switch(action){
			default:
				break;
		}
    }
);
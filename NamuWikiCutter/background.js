var tabs = {};
chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		if(request.msg === "linkCountToBKG"){
			tabs[sender.tab.id] =  request.linkCount;
		}
		else if(request.msg === "linkCountFromPopup"){
			console.log(tabs[request.tabId] ? tabs[request.tabId] : 0);
			sendResponse({
			    msg: "linkCountToPopup", 
			    linkCount: tabs[request.tabId] ? tabs[request.tabId] : 0
			});
		}
	}
);
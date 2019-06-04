chrome.tabs.query({ active: true, currentWindow: true }, function(tabs){
	chrome.runtime.sendMessage({
			tabId: tabs[0].id,
			msg: "linkCountFromPopup"
		},
		function(response) {
			if(response && response.msg === "linkCountToPopup") {
		        document.getElementById("link-count").innerText = response.linkCount;
		    }
		}
	);
});

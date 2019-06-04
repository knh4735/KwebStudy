(function() {
	var linkCount = 0;
	$("a").each(function(){
		if($(this).attr("href") && $(this).attr("href").search("#") !== 0){
			$(this).attr("href", "");
			$(this).click(function(){
				alert("제발 그만 좀 보세요...");
			});
			linkCount++;
		}
	});

	chrome.runtime.sendMessage({
		msg: "linkCountToBKG", 
		linkCount: linkCount
	});
})();
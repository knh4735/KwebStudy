(function() {
	const wrapper = $("#wrapper");
	const clone = $("#entry_clone").clone().removeAttr("id");

	chrome.runtime.sendMessage({msg: "getLecture"}, (response)=>{
		if(!response.Lecture) return;

		const lectures = response.Lecture;

		wrapper.css("height", `${lectures.length * 60 + 5}px`);
		$("body").css("height", `${lectures.length * 60 + 40}px`);

		lectures.forEach((entry)=>{
			let elem = clone.clone();

			elem.attr("title", entry.title);
			elem.children(".title").text(entry.title);
			for(let type in entry.alarm){
				const alarmNum = entry.alarm[type] - entry.record[type];
				elem.children(`.${type}`).attr("href", entry.URL[type]);
				elem.children(`.${type}`).children(".number").text(`${alarmNum}`);
				if(alarmNum > 0) 
					elem.children(`.${type}`).children(".number").css("color", "#cc0000");
			}
			wrapper.append(elem);
		});
	});

	$("#add").on("click", function(){
		chrome.runtime.sendMessage({msg: "editLecture"}, (response)=>{
			close();
		});
	});

	wrapper.on("click", ".entry .element", function(){
		chrome.tabs.create({url: $(this).attr("href")});

		chrome.runtime.sendMessage({msg: "checkoutAlarm", title: $(this).closest(".entry").attr("title")}, (response)=>{
			console.log(1);
		});
	});
})();
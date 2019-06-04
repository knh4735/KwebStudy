let wrapper, addURL, cloneURL;

function isDuplicatedURL(newTitle){
	let flag = false;
	$("#wrapper").children(".entry").each(function(){
		const title = $(this).children(".title").text();
		if(title === newTitle)
			flag = true;
	});

	return flag;
}

function createURL(url){
	return url ? ("https://kulms.korea.ac.kr" + url) : undefined;
}

function addLecture(lecture){
	let clone = cloneURL.clone();

	clone.find(".title").text(lecture.title);
	clone.attr("notice", lecture.notice);
	clone.attr("material", lecture.material);
	clone.attr("assignment", lecture.assignment);

	addURL.before(clone);
	addURL.find("input").val("");
}

(function() {
	wrapper = $("#wrapper"),
	addURL = $("#add_url"),
	cloneURL = $("#url_clone").clone().removeAttr("id");

	// URL 추가
	wrapper.on("click", "#add_btn", function(){
		var url = addURL.children("input").val();

		if(url === ""){
			alert("URL 입력하고 추가하세요.");
			return;
		}

		$.get(url).done(function(data, textStatus, xhr){
			if(data.indexOf("공지사항") === -1 && data.indexOf("Announcement") === -1)
				alert("잘못된 URL 입니다.");

			else{
				const content = $("<div></div>").append($.parseHTML(data));

				let title = content.find("#courseMenuPalette_paletteTitleHeading").text();
				title = title.substring(title.indexOf("]")+1, title.indexOf("-"));

				if(isDuplicatedURL(title)){
					addURL.find("input").val("");
					alert("중복된 URL입니다.");

					return;
				}

				const lecture = {
					"title": title,
					"notice": createURL(content.find("[title='공지사항']").parent().attr("href")) || createURL(content.find("[title='Announcement']").parent().attr("href")),
					"material": createURL(content.find("[title='강의자료']").parent().attr("href")) || createURL(content.find("[title='Course Materials']").parent().attr("href")),
					"assignment": createURL(content.find("[title='과제']").parent().attr("href")) || createURL(content.find("[title='Assignments']").parent().attr("href"))
				}
				console.log(lecture);
				addLecture(lecture);
			}
		});
	});

	// 삭제
	wrapper.on("click", ".delete_btn", function(){
		$(this).parent().remove();
	});

	//저장
	wrapper.on("click", "#save_btn", function(){
		var lectureURLs = [],
			idx = 0;

		$("#wrapper").children(".entry").each(function(){
			lectureURLs[idx++] = {
				"title" : $(this).children("span").text(),
				"URL": {
					"notice" : $(this).attr("notice"),
					"material" : $(this).attr("material"),
					"assignment" : $(this).attr("assignment")
				}
			};
		});

		chrome.runtime.sendMessage({
			msg: "setLecture",
			LectureURL: lectureURLs
		}, (response)=>{
			alert("저장되었습니다.");
			close();
		});
	});

	chrome.runtime.sendMessage({msg: "getLecture"}, function(response){
		if(!response.Lecture) return;

		response.Lecture.forEach((lecture)=>{
			addLecture({
				title: lecture.title,
				...lecture.URL
			});
		});
	});
})();
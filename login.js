let form, btn;

function save_credential(){
	const id = form["id"].value;
	const pw = form["pw"].value;

	if(id === "" || pw === ""){
		alert("아이디와 비밀번호를 입력해주세요.");

		return;
	}
	else{
		chrome.runtime.sendMessage({
			msg: "saveAccount",
			id: id,
			pw: pw
		}, function(response){
			if(response.loggedIn){
				alert("로그인!");
				close();
			}
			else
				alert("로그인 실패;");
		});
	}
}

(function() {
	form = document.getElementById("login_form");
	btn = document.getElementById("entry_login");

	btn.addEventListener("click", (e)=>{
		e.preventDefault();
		save_credential();

		return false;
	});

	window.addEventListener('keydown', (e)=>{
		if(e.keyCode === 13){
			e.preventDefault();
			save_credential();
		}

		return false;
	});
})();
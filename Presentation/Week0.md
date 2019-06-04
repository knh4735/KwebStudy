Chrome Extension
================
0주차
---
### 스터디 멤버
- 김낙현, 김은주, 이소라, 박현민, 이건우, 연주영, 김석희, 이찬영

### 기본 구성

1. manifest.json : 메타 데이터를 담은 JSON 형식의 파일
	- Extension에 필요한 요소들을 등록할 수 있습니다. 
~~~json
{
    "name": "Test",								
    "version": "0.0.1",							
    "manifest_version": 2,
    "description": "Chrome Extension Test",		
    "homepage_url": "https://kweb.korea.ac.kr",	
    "background": {
        "scripts": [
            "background.js"
        ],
        "persistent": false
    },
    "content_scripts": [ 
        {
            "matches": ["<all_urls>"], 
            "js": ["jquery-1.12.0.min.js", "content.js"], 
            "css": ["content.css"], 
            "run_at": "document_end" 
        }
    ],
    "browser_action": {
        "default_title": "Extension!",
        "default_popup": "popup.html"
    },
    "permissions": [
        "tabs"
    ]
}
~~~

2. `background` : 백그라운드에서 실행되어 백엔드 같은 역할을 담당하는 부분
	- 브라우저에서 발생하는 이벤트에 리스너를 등록해 원하는 기능을 수행할 수 있습니다.
	- 다른 스크립트에서 background와 통신할 수 있습니다.
	- `persistent` : background가 항상 실행되어 있어야 할 때 사용합니다.

3. `content_scripts` : 특정 url이 로딩될 때에 처리를 담당하는 부분
	- 지정한 스크립트와 CSS가 해당 페이지의 DOM을 사용할 수 있습니다.
	- run_at : 스크립트와 CSS가 실행되는 시점입니다. `document_[idle|start|end]`로 지정할 수 있습니다.

4. `browser_action` : 브라우저 오른쪽 위에 나타나는 아이콘에 관련된 부분
	- `default_title` : 아이콘에 커서를 올렸을 때 나타나는 문구
	- `default_popup` : 아이콘을 클릭했을 때 나타날 페이지
	- 이외에도 `default_icon` 등의 내용을 등록할 수 있습니다.

5. 기타
	- `web_accessible_resources` : 로드된 페이지의 컨텍스트에서 실행될 스크립트나 페이지를 지정할 수 있습니다.
	- `manifest_version` : manifest 형식의 버전으로, 2만 사용하는 것이 좋습니다.
	- `permissions` : Extension에서 필요한 리소스에 대한 권한을 명시합니다.

___
### Extension 등록
1. Extension의 파일들을 한 폴더에 준비합니다.
2. 크롬 브라우저에서 **chrome://extensions**로 이동합니다.
3. 오른쪽 상단의 개발자 모드를 켜고, **왼쪽 상단의 압축해제된 확장 프로그램을 로드합니다**를 클릭합니다.
4. 준비한 폴더를 선택하여 등록합니다.
5. 이제 오른쪽 상단의 확장 프로그램에 추가되어 사용할 수 있습니다!

___
### 앞으로의 계획
0. 기초적인 개발 방법과 구성 등 소개
1. 간단한 주제로 구현
2. 아이디어를 결정해서 팀으로 또는 각자 프로젝트 진행
- 이후. 서로 문제점이나 기술같은거 공유하면서 내용 발표

#### 참조
- [manifest](https://blog.martinwork.co.kr/javascript/2018/09/17/chrome-extension-manifest.html "manifest"), 
[구성1](http://day-think.tumblr.com/post/64678968728/성대사랑-크롬확장-플러그인-개발기 "구성1"), 
[구성2](https://www.letmecompile.com/chrome-extension-with-react/ "구성2"), 
[구성3](https://joshuajangblog.wordpress.com/tag/크롬-익스텐션/ "구성3"), 
[Chrome Background](https://developer.chrome.com/extensions/background_pages "Chrome Background"), 
[Chrome Permission](https://developer.chrome.com/extensions/declare_permissions "Chrome Permission"), 
[Chrome Content](https://developer.chrome.com/extensions/content_scripts#functionality "Chrome Content"), 
[Chrome 등록하기](https://support.google.com/chrome/a/answer/2714278?hl=ko "Chrome 등록하기")

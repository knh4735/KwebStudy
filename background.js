const kulmsURL =
  "https://kulms.korea.ac.kr/webapps/portal/execute/tabs/tabAction?tab_tab_group_id=_2_1";

const init = () => {
  //Loading sign on badge
  chrome.browserAction.setBadgeText({ text: "..." });
  chrome.browserAction.setBadgeBackgroundColor({ color: "#888800" });

  // Regularly Access (30 minutes) to Blackboard and get lecture diff
  access();
  let accessInterval = setInterval(access, INTERVAL_MINUTES(30));

  chrome.runtime.onMessage.addListener(msgListener);
};

const INTERVAL_MINUTES = minutes => 1000 * 60 * minutes;

const isLoggedIn = data => data.indexOf("Go to Login page") === -1;

const makeLoginForm = (id, pw) =>
  `id=${id}&pw=${pw}&returnURL=kulms.korea.ac.kr`;

const loginBlackboard = async (id, pw) => {
  const loginData = makeLoginForm(id, pw);
  const loginURL =
    "https://kulms.korea.ac.kr/auth-saml/saml/login?apId=_147_1&redirectUrl=https%3A%2F%2Fkulms.korea.ac.kr%2Fwebapps%2Fportal%2Fexecute%2FdefaultTab";

  try {
    const beforeLoginPage = await $.get(loginURL);
    const beforeLoginPageForm = $("<div></div>")
      .append($.parseHTML(beforeLoginPage))
      .find("form");

    const loginPage = await $.post(
      beforeLoginPageForm.attr("action"),
      beforeLoginPageForm.serialize()
    );
    const loginForm = $("<div></div>")
      .append($.parseHTML(loginPage))
      .find("form");

    loginForm.find("input[name='user_id']").remove();
    loginForm.find("input[name='user_password']").remove();
    loginForm
      .find("input[name='user_timezone_offset']")
      .val(new Date().getTimezoneOffset());
    loginForm.append("<input name='user_id' value='" + id + "'/>");
    loginForm.append("<input name='user_password' value='" + pw + "'/>");

    const tokenPage = await $.post(
      "https://sso.korea.ac.kr" + loginForm.attr("action"),
      loginForm.serialize()
    );
    const tokenPageForm = $("<div></div>")
      .append($.parseHTML(tokenPage))
      .find("form");

    const response = await $.post(
      tokenPageForm.attr("action"),
      tokenPageForm.serialize()
    );

    return Promise.resolve(isLoggedIn(response));
  } catch (err) {
    console.log(err);
    return false;
  }
};

const reqBlackboard = async () => {
  try {
    const data = await $.get(kulmsURL);
    return Promise.resolve(data);
  } catch (err) {
    console.log(err);
    return false;
  }
};

const getNumberOfEachContents = async url => {
  const data = await $.get(url);
  const numberOfContents = $("<div></div>")
    .append($.parseHTML(data))
    .find("#content ul:not(.clearfix)[class]")
    .children().length;

  return Promise.resolve(numberOfContents);
};

const getNumberOfContents = async lectureURLs => {
  let contents = {};

  for (let type in lectureURLs) {
    const num = await getNumberOfEachContents(lectureURLs[type]);
    contents[type] = num;
  }

  return contents;
};

const setLectureAlarm = async lectures => {
  console.log(lectures);

  return await Promise.all(
    lectures.map(async lecture => {
      const newLecture = {
        ...lecture,
        alarm: await getNumberOfContents(lecture.URL)
      };
      return newLecture;
    })
  );
};

const updateBadge = lectures => {
  let alarms = 0;

  lectures.forEach(lecture => {
    for (let type in lecture.alarm)
      if (lecture.alarm[type] > lecture.record[type])
        alarms += lecture.alarm[type] - lecture.record[type];
  });

  chrome.browserAction.setBadgeText({ text: `${alarms}` });
  if (alarms > 0)
    chrome.browserAction.setBadgeBackgroundColor({ color: "#ff0000" });
  else chrome.browserAction.setBadgeBackgroundColor({ color: "#0000ff" });
};

const updateLectureAlarm = async lectures => {
  const newLecture = await setLectureAlarm(lectures);

  chrome.storage.local.set({ lecture: newLecture });

  updateBadge(newLecture);
};

const access = async () => {
  const data = await reqBlackboard();
  if (!data) return;

  // GET INFORMATIONS IF SET LECTURES
  // OTHERWISE GET LECTURES AND URL
  // THEN SHOW
  if (isLoggedIn(data)) {
    console.log("Logged In");

    chrome.storage.local.set({ available: true });

    chrome.storage.local.get(["lecture"], result => {
      if (result.lecture)
        // IF lecture URL is set then Parse url
        updateLectureAlarm(result.lecture);
      else {
        // IF lecture URL is not set
        chrome.tabs.create({ url: kulmsURL });
        chrome.tabs.create({ url: "set_lecture.html" });
      }
    });
  } else {
    // Login and Re-Access
    console.log("Login Needed");

    chrome.storage.local.get(["account", "available"], async result => {
      if (result.account && result.available) {
        //IF Account is saved & Available, Use it
        let account = result.account;
        let id, pw;

        id = account.id;
        pw = CryptoJS.AES.decrypt(account.pw, id).toString(CryptoJS.enc.Utf8);

        const loggedIn = await loginBlackboard(id, pw);

        if (loggedIn) access();
        else chrome.tabs.create({ url: "login.html" });
      } // IF Need to register account
      else chrome.tabs.create({ url: "login.html" });
    });
  }
};

const msgListener = (request, sender, sendResponse) => {
  if (!request.msg) {
    console.log(request);
    return false;
  }

  switch (request.msg) {
    case "getLecture":
      chrome.storage.local.get(["lecture"], result => {
        sendResponse({ Lecture: result.lecture });
      });
      break;

    case "checkoutAlarm":
      const title = request.title;
      chrome.storage.local.get(["lecture"], function(result) {
        const updatedLecture = result.lecture.map(lecture => {
          if (lecture.title === title)
            return {
              ...lecture,
              record: lecture.alarm
            };
          else return lecture;
        });

        chrome.storage.local.set({ lecture: updatedLecture });
        updateBadge(updatedLecture);
      });

      break;

    case "refreshAlarm":
      access();
      sendResponse({});

      break;

    case "setLecture":
      const lectureURLs = request.LectureURL;
      const defaultLecture = {
        title: "",
        URL: {
          assignment: "",
          notice: "",
          material: ""
        },
        record: {
          assignment: 0,
          notice: 0,
          material: 0
        },
        alarm: {
          assignment: 0,
          notice: 0,
          material: 0
        }
      };

      chrome.storage.local.get(["lecture"], function(result) {
        const orgLectures = result.lecture;

        const newLecture = lectureURLs.map(lecture => {
          // 이미 등록된 강의
          if (
            orgLectures &&
            orgLectures.findIndex(
              orgLecture => orgLecture.title === lecture.title
            ) !== -1
          ) {
            const idx = orgLectures.findIndex(
              orgLecture => orgLecture.title === lecture.title
            );
            orgLectures[idx].URL = lecture.URL;

            return orgLectures[idx];
          }
          // 새로 등록된 강의
          else {
            const newLec = {
              ...defaultLecture,
              title: lecture.title,
              URL: lecture.URL
            };

            return newLec;
          }
        });

        chrome.storage.local.set({ lecture: newLecture });

        sendResponse({});

        access();
      });

      break;

    case "editLecture":
      chrome.tabs.create({ url: "set_lecture.html" });
      sendResponse({});
      break;

    case "saveAccount":
      const account = {
        id: request.id,
        pw: CryptoJS.AES.encrypt(request.pw, request.id)
      };

      chrome.storage.local.set({ account: account });

      loginBlackboard(request.id, request.pw).then(loggedIn => {
        sendResponse({ loggedIn: loggedIn });

        if (loggedIn) access();

        return true;
      });

      break;

    default:
      return false;
  }

  return true;
};

init();

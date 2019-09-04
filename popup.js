const loadAlarm = () => {
  const clone = $("#entry_clone")
    .clone()
    .removeAttr("id");
  const wrapper = $("#wrapper");

  chrome.runtime.sendMessage({ msg: "getLecture" }, response => {
    if (!response.Lecture) return;

    const lectures = response.Lecture;

    wrapper.empty();
    wrapper.css("height", `${lectures.length * 60 + 5}px`);
    $("body").css("height", `${lectures.length * 60 + 20}px`);

    lectures.forEach(entry => {
      console.log(entry);
      let elem = clone.clone();

      elem.attr("title", entry.title);
      elem.children(".title").text(entry.title);
      for (let type in entry.alarm) {
        const alarmNum = entry.alarm[type] - entry.record[type];
        elem
          .children(`.${type}`)
          .attr("href", entry.URL[type])
          .removeClass("empty");
        elem
          .children(`.${type}`)
          .children(".number")
          .text(`${alarmNum}`);
        if (alarmNum > 0)
          elem
            .children(`.${type}`)
            .children(".number")
            .css("color", "#cc0000");
      }
      wrapper.append(elem);
    });
  });
};

(function() {
  loadAlarm();

  $("#add").on("click", function() {
    chrome.runtime.sendMessage({ msg: "editLecture" }, response => {
      close();
    });
  });

  $("#refresh").on("click", function() {
    chrome.runtime.sendMessage({ msg: "refreshAlarm" }, response => {
      loadAlarm();
    });
  });

  $("#wrapper").on("click", ".entry .element:not(.empty)", function() {
    chrome.tabs.create({ url: $(this).attr("href") });
    chrome.runtime.sendMessage({
      msg: "checkoutAlarm",
      title: $(this)
        .closest(".entry")
        .attr("title")
    });
  });
})();

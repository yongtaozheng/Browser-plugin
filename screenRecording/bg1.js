// content_script.js
(() => {
  try {
    sendMessage("getTabId");
    const url = new URL(location.href);
    const isStartMediaRecorder = url.searchParams.get("isStartMediaRecorder");
    if (isStartMediaRecorder) {
      setInterval(() => {
        const isMediaRecorderEnd = localStorage.getItem("isMediaRecorderEnd");
        if (isMediaRecorderEnd === "true") {
          localStorage.setItem("isMediaRecorderEnd", false);
          sendMessage("stopMediaRecorder");
        }
      }, 1000);
    }
    function sendMessage(greeting, cb = null) {
      chrome.runtime.sendMessage({ greeting }, function (response) {
        if (chrome.runtime.lastError) {
          return;
        }
        if (response) {
          console.log("Background script responded:", response);
          if (cb) {
            cb(response);
          }
        }
      });
    }
  } catch (err) {
    console.error(err);
  }
})();

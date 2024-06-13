(() => {
  try {
    localStorage.setItem("isMediaRecorderEnd", false);
    const url = new URL(location.href);
    const isStartMediaRecorder = url.searchParams.get("isStartMediaRecorder");
    if (isStartMediaRecorder) startMediaRecorder();

    async function startMediaRecorder() {
      var stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
      });
      var mime = MediaRecorder.isTypeSupported("video/webm; codecs=vp9")
        ? "video/webm; codecs=vp9"
        : "video/webm";
      var mediaRecorder = new MediaRecorder(stream, { mimeType: mime }); //录制
      var chunks = [];
      mediaRecorder.addEventListener("dataavailable", function (e) {
        chunks.push(e.data);
      }); //停止
      mediaRecorder.addEventListener("stop", function () {
        var blob = new Blob(chunks, { type: chunks[0].type });
        var url = URL.createObjectURL(blob);
        var a = document.createElement("a");
        a.href = url;
        a.download = "video.webm";
        a.click();
        setTimeout(() => {
          localStorage.setItem("isMediaRecorderEnd", true);
        }, 200);
      }); //手动启动
      mediaRecorder.start();
    }
  } catch (err) {
    console.error(err);
  }
})();

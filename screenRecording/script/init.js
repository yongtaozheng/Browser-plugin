(() => {
  try {
    function getFormattedCurrentTime() {
      const now = new Date(); // 获取当前时间
      const year = now.getFullYear(); // 年份
      const month = (now.getMonth() + 1).toString().padStart(2, "0"); // 月份，加1因为月份是从0开始的
      const day = now.getDate().toString().padStart(2, "0"); // 日期
      const hours = now.getHours().toString().padStart(2, "0"); // 小时
      const minutes = now.getMinutes().toString().padStart(2, "0"); // 分钟
      const seconds = now.getSeconds().toString().padStart(2, "0"); // 秒

      // 格式化为 "yyyy-MM-dd hh:mm:ss"
      return `${year}${month}${day}${hours}${minutes}${seconds}`;
    }

    localStorage.setItem("isMediaRecorderEnd", false);
    const url = new URL(location.href);
    const isStartMediaRecorder = url.searchParams.get("isStartMediaRecorder");
    if (isStartMediaRecorder) {
      document.body.style.display = "flex";
      document.body.innerHTML = `<div
        style="
          font-size: large;
          margin: auto;
          font-weight: bold;
          text-align: center;
        "
      >
        录制中
      </div>`;
      startMediaRecorder();
    }

    function startRecorder(stream) {
      var mime = MediaRecorder.isTypeSupported("video/webm; codecs=vp9")
        ? "video/webm; codecs=vp9"
        : "video/webm";
      var mediaRecorder = new MediaRecorder(stream, { mimeType: mime }); // 录制

      var chunks = [];
      mediaRecorder.addEventListener("dataavailable", function (e) {
        chunks.push(e.data);
      });

      mediaRecorder.addEventListener("stop", function () {
        var blob = new Blob(chunks, { type: "video/webm" }); // 确保Blob的MIME类型正确
        var url = URL.createObjectURL(blob);
        var a = document.createElement("a");
        a.href = url;
        a.download = getFormattedCurrentTime() + "-video.webm";
        a.click();
        setTimeout(() => {
          localStorage.setItem("isMediaRecorderEnd", true);
        }, 200);
      });

      // 监听用户取消屏幕共享
      stream.getTracks().forEach((track) => {
        track.addEventListener("ended", function (e) {
          console.log("轨道结束: ", e);
          // 用户取消屏幕共享，执行清理操作
          mediaRecorder.stop(); // 停止录制
        });
      });

      mediaRecorder.start(); // 手动启动录制
    }
    function startMediaRecorder() {
      navigator.mediaDevices
        .getDisplayMedia({
          video: true,
        })
        .then((stream) => {
          startRecorder(stream);
        })
        .catch((err) => {
          console.warn(err);
          localStorage.setItem("isMediaRecorderEnd", true);
        });
    }
  } catch (err) {
    console.warn(err);
  }
})();

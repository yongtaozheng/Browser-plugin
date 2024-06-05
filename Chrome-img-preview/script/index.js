(() => {
  try {
    const imgs = document.querySelectorAll("img");
    const imgList = [];
    for (let i = 0; i < imgs.length; i++) {
      const img = imgs[i];
      imgList.push(img.src);
      img.addEventListener("click", (e) => {
        event.stopPropagation(); // 阻止事件继续传播
        imagePreviewJY.show(imgList, i);
      });
    }
  } catch (err) {
    console.log("err:", err);
  }
})();

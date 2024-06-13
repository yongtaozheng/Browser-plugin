(() => {
  try {
    let index = 0;
    const imgList = [];
    const run = () => {
      const imgs = document.querySelectorAll("img");
      for (let i = index; i < imgs.length; i++) {
        index = i;
        const img = imgs[i];
        imgList.push(img.src);
        img.addEventListener("contextmenu", () => {
          localStorage.setItem("chromeImgPreviewIndex", i);
          window.chromeImgPreviewIndex = i;
        });
        let node = img;
        while (1) {
          const p = node.parentElement;
          if (!p) break;
          if (p.children.length > 1) break;
          p.addEventListener("contextmenu", () => {
            localStorage.setItem("chromeImgPreviewIndex", i);
            window.chromeImgPreviewIndex = i;
          });
          node = p;
        }
      }
      localStorage.setItem("chromeImgPreviewImgList", JSON.stringify(imgList));
      window.chromeImgPreviewImgList = imgList;
    };
    domObserver(document.body, run);
    setTimeout(() => {
      run();
    }, 500);
  } catch (err) {
    console.log("err:", err);
  }
})();

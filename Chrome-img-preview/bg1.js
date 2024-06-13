if (!window.ImagePreviewJY123) {
  class ImagePreviewJY123 {
    constructor() {
      this.init();
    }
    init() {
      const menuNav = document.getElementById("menuNav") || {};
      const appsBar = document.getElementById("appsBar") || {};
      const menuNavWidth = menuNav.offsetWidth || 0;
      const appsBarHeight = appsBar.offsetHeight || 0;
      this.overlay = document.createElement("div");
      this.overlay.style.cssText =
        "position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0, 0, 0, 0.8); display: none; z-index: 1000; overflow: hidden;";

      this.closeButton = document.createElement("button");
      this.closeButton.innerHTML = "&times;";
      this.closeButton.style.cssText =
        "position: fixed; top: 20px; right: 20px; width: 40px; height: 40px; border-radius: 50%; background: rgba(255, 255, 255, 0.8); z-index: 1002; border: none; cursor: pointer;font-size: 36px;line-height: 40px;color: #fff;opacity: 0.8;";
      this.closeButton.onclick = this.close.bind(this);
      this.overlay.appendChild(this.closeButton);

      this.image = document.createElement("img");
      this.image.style.cssText = `background: #fff;position: fixed; top: 50%; left: calc(50% + ${
        menuNavWidth / 2
      }px); transform: translate(-50%, -50%) scale(1); max-width:calc(100% - ${
        menuNavWidth + 30
      }px); max-height: 100%; z-index: 1001; cursor: grab;`;
      this.image.onload = () => {
        this.image.style.cursor = "grabbing";
      };
      this.image.addEventListener("drag", (e) => {
        e.preventDefault();
        return;
      });
      this.image.addEventListener("dragstart", (e) => {
        e.preventDefault();
        return;
      });
      this.image.addEventListener("click", (e) => {
        e.stopPropagation();
      });
      this.overlay.appendChild(this.image);

      this.images = [];
      this.currentImageIndex = 0;

      // 创建左右切换按钮
      this.prevButton = document.createElement("button");
      this.prevButton.innerHTML = "&#10094;"; //

      this.prevButton.style.cssText = `position: fixed; top: 50%; left: ${
        menuNavWidth + 10
      }px; z-index: 1002; cursor: pointer;height: 50px;font-size: 20px;`;
      this.prevButton.addEventListener("click", (event) => {
        event.stopPropagation(); // 阻止事件继续传播
        this.switchImage(-1);
      });
      this.overlay.appendChild(this.prevButton);

      this.nextButton = document.createElement("button");
      this.nextButton.innerHTML = "&#10095;"; // →
      this.nextButton.style.cssText =
        "position: fixed; top: 50%; right: 10px; z-index: 1002; cursor: pointer;height: 50px;font-size: 20px;";
      this.nextButton.addEventListener("click", (event) => {
        event.stopPropagation(); // 阻止事件继续传播
        this.switchImage(1);
      });
      this.overlay.appendChild(this.nextButton);

      //图片下标显示
      this.imgIndexText = document.createElement("div");
      this.imgIndexText.style.cssText = `position: fixed; bottom: ${
        appsBarHeight + 10
      }px; left: 50%; z-index: 1002; cursor: pointer;color:#fff;background: rgba(0, 0, 0, 0.8);padding: 5px 10px;border-radius: 5px;font-size: 15px;opacity: 0.8;`;
      this.overlay.appendChild(this.imgIndexText);

      // 初始化滚动偏移量和缩放级别
      this.scale = 1;
      this.scrollOffsetX = 0;
      this.scrollOffsetY = 0;
      this.lastWheelEventTime = 0;
      this.wheelEventInterval = 50; // 调整滚轮缩放的灵敏度
      this.overlay.id = "imagePreviewJY123";
      const oldDom = document.getElementById("imagePreviewJY123");
      if (oldDom) {
        oldDom.parentNode.removeChild(oldDom);
      }
      document.body.appendChild(this.overlay);
      console.log(
        "%c Line:89 🍪 document.body",
        "color:#42b983",
        document.body
      );
    }

    show(images, index = 0) {
      this.currentImageIndex = index;
      this.images = images; // 接收图片URL数组
      this.displayImage(this.currentImageIndex); // 显示第一张图片
      this.overlay.style.display = "block";
      console.log("%c Line:97 🥐 this.overlay", "color:#3f7cff", this.overlay);

      // 点击遮罩或图片时关闭预览
      this.overlay.addEventListener("click", this.close.bind(this));

      // 监听滚轮事件进行缩放
      this.overlay.addEventListener("wheel", this.handleWheel.bind(this));

      // 监听拖动事件
      this.image.addEventListener("mousedown", this.handleDragStart.bind(this));
      document.addEventListener("mousemove", this.handleDrag.bind(this));
      document.addEventListener("mouseup", this.handleDragEnd.bind(this));
    }

    handleWheel(event) {
      // 阻止默认的滚动行为
      event.preventDefault();

      // 只处理垂直滚动
      if (event.deltaY === 0) return;

      // 计算缩放时间间隔，避免快速滚动时响应过快
      const currentEventTime = new Date().getTime();
      if (currentEventTime - this.lastWheelEventTime < this.wheelEventInterval)
        return;
      this.lastWheelEventTime = currentEventTime;

      // 根据滚轮方向调整缩放级别
      const zoomStep = 0.1; // 每次滚轮缩放的量
      this.scale += event.deltaY < 0 ? zoomStep : -zoomStep;

      // 限制缩放级别在合理范围内
      this.scale = Math.max(0.1, Math.min(this.scale, 5));

      const transform = this.image.style.transform.replace(
        /scale\((\d+(?:\.\d+)?)\)/g,
        `scale(${this.scale})`
      );

      // 应用缩放
      this.image.style.transform = transform;
    }

    handleDragStart(event) {
      this.isDragging = true;
      this.startX = event.clientX;
      this.startY = event.clientY;
      this.startScrollOffsetX = this.scrollOffsetX;
      this.startScrollOffsetY = this.scrollOffsetY;
    }

    handleDrag(event) {
      if (!this.isDragging) return;

      const dx = event.clientX - this.startX;
      const dy = event.clientY - this.startY;

      // 更新滚动偏移量
      this.scrollOffsetX = this.startScrollOffsetX + dx;
      this.scrollOffsetY = this.startScrollOffsetY + dy;

      // 应用平移
      this.image.style.transform = `translate(-50%, -50%) scale(${this.scale}) translate(${this.scrollOffsetX}px, ${this.scrollOffsetY}px)`;
    }

    handleDragEnd() {
      this.isDragging = false;
    }

    switchImage(step) {
      const newIndex = this.currentImageIndex + step;
      this.displayImage((newIndex + this.images.length) % this.images.length);
    }

    displayImage(index) {
      if (index < 0 || index >= this.images.length) return;
      this.currentImageIndex = index;
      this.image.src = this.images[index];
      // 重置缩放和平移
      this.scale = 1;
      this.scrollOffsetX = 0;
      this.scrollOffsetY = 0;
      this.image.style.transform = "translate(-50%, -50%) scale(1)";
      this.image.style.cursor = "zoom-in";
      this.imgIndexText.innerText = `${index + 1}/${this.images.length}`;
    }

    close() {
      this.overlay.style.display = "none";
      this.image.src = "";
      this.scale = 1;
      this.scrollOffsetX = 0;
      this.scrollOffsetY = 0;
      this.image.style.transform = "translate(-50%, -50%) scale(1)";
      this.image.style.cursor = "zoom-in";
      this.isDragging = false;
    }
  }

  window.ImagePreviewJY123 = ImagePreviewJY123;
  window.imagePreviewJY123 = new ImagePreviewJY123();
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  const { action } = request;
  console.log("%c Line:3 🍎 action", "color:#465975", action);
  if (action === "showImg") {
    const imgList = JSON.parse(
      localStorage.getItem("chromeImgPreviewImgList") || "[]"
    );
    const index = localStorage.getItem("chromeImgPreviewIndex") || 0;
    console.log("%c Line:8 🥔 imgList, index", "color:#e41a6a", imgList, index);
    if (imgList[index]) {
      console.log(
        "%c Line:208 🥓 imgList[index]",
        "color:#b03734",
        imgList[index]
      );
      console.log(document.body);
      imagePreviewJY123.show(imgList, index);
    }
  }
});

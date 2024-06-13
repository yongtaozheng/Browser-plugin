if (!window.ToastJY) {
  class ToastJY {
    constructor(config = {}) {
      this.config = config;
      this.pDom = null;
      this.init(config.pDom);
    }

    init(pDom = null) {
      let body = document.body;
      if (pDom) body = pDom;
      this.pDom = body;
      const toastContainer = document.createElement("div");
      toastContainer.id = "toastContainer";
      const styleObj = {
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        background: "rgba(0, 0, 0, 0.8)",
        color: "#ffffff",
        fontSize: "16px",
        opacity: 0.7,
        transition: "opacity 0.3s ease-in-out",
        padding: "10px",
        "border-radius": "5px",
        display: "none",
        textAlign: "center",
      };
      for (const key in styleObj) toastContainer.style[key] = styleObj[key];
      body.appendChild(toastContainer);

      const loader = document.createElement("div");
      loader.id = "toastLoader";
      const loaderStyleObj = {
        border: "4px solid #f3f3f3",
        borderTop: "4px solid #3498db",
        borderRadius: "50%",
        width: "20px",
        height: "20px",
        animation: "spin 1s linear infinite",
        margin: "0 auto 10px",
        display: "none",
      };
      for (const key in loaderStyleObj) loader.style[key] = loaderStyleObj[key];
      toastContainer.appendChild(loader);

      const text = document.createElement("div");
      text.id = "toastText";
      const textStyleObj = {
        marginTop: "5px",
      };
      for (const key in textStyleObj) text.style[key] = textStyleObj[key];
      toastContainer.appendChild(text);

      const keyframes = `
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `;
      const style = document.createElement("style");
      style.innerHTML = keyframes;
      document.head.appendChild(style);
    }

    showToast(text) {
      const textElem = this.pDom.querySelector("#toastText");

      // 设置Toast提示文本
      textElem.innerText = text;

      // 显示Toast提示
      this.show();

      // 3秒后隐藏Toast提示
      setTimeout(() => this.hide(), 3000);
    }

    showLoading(text = "加载中...") {
      const loader = this.pDom.querySelector("#toastLoader");
      const textElem = this.pDom.querySelector("#toastText");

      // 设置Toast提示文本为加载中
      textElem.innerText = text;

      // 显示Toast提示和加载动画
      loader.style.display = "block";
      this.show();
    }

    show() {
      const toastContainer = this.pDom.querySelector("#toastContainer");

      // 显示Toast提示
      toastContainer.style.display = "block";
    }

    hide() {
      try {
        const toastContainer = document.querySelector("#toastContainer");
        const loader = document.querySelector("#toastLoader");

        // 隐藏Toast提示和加载动画
        toastContainer.style.display = "none";
        loader.style.display = "none";
      } catch (err) {}
    }
  }
  window.ToastJY = ToastJY;
  window.toastJY = new ToastJY();
}

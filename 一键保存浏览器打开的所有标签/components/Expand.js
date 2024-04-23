if (!window.ExpandJY) {
  class ExpandJY {
    constructor(config = {}) {
      this.config = config;
      this.isOpen = true;
      this.init();
    }
    init() {}
    obj2Style(obj) {
      const list = [];
      for (const key in obj) {
        list.push(`${key}:${obj[key]}`);
      }
      return list.join(";");
    }
    generateBtn(
      text,
      fn,
      config = {
        margin: "auto",
        cursor: "pointer",
        color: "#5598EF",
        "text-decoration": "underline",
      }
    ) {
      const btn = document.createElement("span");
      btn.style = this.obj2Style(config);
      btn.innerText = text; //this.isOpen ? "收起" : "展开";
      btn.onclick = fn;
      return btn;
    }
    generate(config = this.config) {
      const dom = document.createElement("div");
      dom.classList.add("ExpandJY");
      const header = this.generateHeader(config);
      const body = this.generateBody(config);
      dom.appendChild(header);
      dom.appendChild(body);
      return dom;
    }
    generateHeader(config = this.config) {
      const dom = document.createElement("div");
      dom.classList.add("ExpandJYHeader");
      dom.style = this.obj2Style({
        display: "flex",
        width: "100%",
        "border-bottom": "1px solid #e5dada",
      });
      let title = config.title || "标题";
      if (typeof title === "string") {
        const titleDom = document.createElement("div");
        titleDom.innerText = title;
        title = titleDom;
      }
      title.style.padding = "10px 0";
      title.style.margin = "0 10px";
      title.style.flex = 1;
      const operateBox = document.createElement("div");
      const btn = this.generateBtn(this.isOpen ? "收起" : "展开", () => {
        this.isOpenChange();
      });
      this.expandBtn = btn;
      operateBox.style = this.obj2Style({
        display: "flex",
        padding: "10px",
      });
      operateBox.append(btn);
      const btns = config.btns || [];
      for (const btnInfo of btns) {
        const btnTmp = this.generateBtn(
          btnInfo.text,
          btnInfo.cb,
          btnInfo.styleObj
        );
        operateBox.append(btnTmp);
      }
      dom.appendChild(title);
      dom.appendChild(operateBox);
      return dom;
    }
    generateBody(config = this.config) {
      const dom = document.createElement("div");
      dom.classList.add("ExpandJYBody");
      let body = config.body || "容器";
      if (typeof body === "string") {
        const bodyDom = document.createElement("div");
        bodyDom.innerText = body;
        body = bodyDom;
      }
      dom.appendChild(body);
      this.body = dom;
      return dom;
    }
    isOpenChange() {
      this.isOpen = !this.isOpen;
      this.expandBtn.innerText = this.isOpen ? "收起" : "展开";
      this.body.style.display = this.isOpen ? "block" : "none";
    }
  }
  window.ExpandJY = ExpandJY;
  window.expandJY = new ExpandJY();
}

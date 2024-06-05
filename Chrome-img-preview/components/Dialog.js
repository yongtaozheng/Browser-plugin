if (!window.DialogJY) {
  class DialogJY {
    constructor(options = {}) {
      this.options = options;
      this.el = document.createElement("div");
      this.el.className = "dialogJY-modal";
      this.el.setAttribute("aria-hidden", "true");
      this.init();
    }

    init() {
      const { title, content, okText, cancelText } = this.options;

      // 创建弹窗的内部结构
      const modalDialog = document.createElement("div");
      modalDialog.className = "dialogJY-modal-dialog";

      const modalHeader = document.createElement("div");
      modalHeader.className = "dialogJY-modal-header";

      const modalTitle = document.createElement("h2");
      modalTitle.className = "dialogJY-modal-title";
      modalTitle.textContent = title || "Modal Title";

      const closeButton = document.createElement("button");
      closeButton.className = "dialogJY-close-button";
      closeButton.textContent = "×";
      closeButton.onclick = this.close.bind(this);

      modalHeader.appendChild(closeButton);
      modalHeader.appendChild(modalTitle);

      const modalBody = document.createElement("div");
      modalBody.className = "dialogJY-modal-body";
      if (typeof content === "string") modalBody.textContent = content;
      else modalBody.append(content);
      const modalActions = document.createElement("div");
      modalActions.className = "dialogJY-modal-actions";

      const okButton = document.createElement("button");
      okButton.className = "dialogJY-button";
      okButton.textContent = okText || "OK";
      okButton.onclick = () => {
        this.close();
        if (this.options.onOk) this.options.onOk();
      };

      const cancelButton = document.createElement("button");
      cancelButton.className = "dialogJY-button";
      cancelButton.textContent = cancelText || "Cancel";
      cancelButton.onclick = this.close.bind(this);

      modalActions.appendChild(cancelButton);
      modalActions.appendChild(okButton);

      modalDialog.appendChild(modalHeader);
      modalDialog.appendChild(modalBody);
      modalDialog.appendChild(modalActions);

      this.el.appendChild(modalDialog);
      document.body.appendChild(this.el);
    }

    close() {
      this.el.setAttribute("aria-hidden", "true");
      // 这里可以添加一些清理工作，如移除事件监听器
    }

    open() {
      this.el.removeAttribute("aria-hidden");
    }
  }
  window.DialogJY = DialogJY;
  window.dialogJY = new DialogJY();
}

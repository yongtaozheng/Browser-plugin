(() => {
  const hList = new Array(6).fill(null).map((_, i) => "h" + (i + 1));
  let preClickItem = null;
  let titleList = [];
  hList.forEach((item) => {
    titleList.push(...document.querySelectorAll(item));
  });
  titleList = titleList.filter((item) => {
    const classList = [...item.classList];
    return !classList.includes("chromeCatalogueJY");
  });
  titleList = titleList.sort((a, b) => {
    return a.offsetTop - b.offsetTop;
  });
  const panel = document.createElement("div");
  titleList.forEach((item) => {
    const hItem = document.createElement("div");
    hItem.classList.add("chromeCatalogueJY");
    hItem.innerText = item.innerText;
    const ind = (parseInt(item.localName.slice(1)) || 1) - 1;
    hItem.style.marginLeft = ind + "em";
    hItem.onclick = () => {
      window.scrollTo(0, item.offsetTop - 100);
      if (preClickItem) {
        preClickItem.item.style.color = preClickItem.color;
        preClickItem.item.style.background = preClickItem.background;
        preClickItem.menuItem.style.color = "black";
      }
      preClickItem = {
        item,
        color: item.style.color,
        background: item.style.background,
        menuItem: hItem,
      };
      item.style.color = "#fff";
      item.style.background = "orange";
      hItem.style.color = "orange";
    };
    panel.appendChild(hItem);
  });
  const chromeCatalogueJY = document.querySelector("#chromeCatalogueJY");
  if (chromeCatalogueJY) {
    document.body.removeChild(chromeCatalogueJY);
  }
  const titleDiv = document.createElement("div");
  titleDiv.innerText = "页面目录提取";
  const expandBox = new ExpandJY().generate({
    title: titleDiv,
    body: panel,
  });
  expandBox.style = obj2Style({
    right: "0",
    position: "fixed",
    top: "10px",
    "z-index": "99999",
    cursor: "pointer",
    "max-height": "60vh",
    overflow: "scroll",
    background: "#fff",
    "text-align": "left",
    "padding-left": "1em",
    opacity: "0.8",
    color: "black",
    "font-weight": "bold",
    "max-width": "30vw",
  });
  expandBox.id = "chromeCatalogueJY";
  document.body.appendChild(expandBox);
})();

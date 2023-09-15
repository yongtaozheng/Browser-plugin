const moonFromJY = document.createElement("div");
moonFromJY.id = "moonFromJY";
document.body.appendChild(moonFromJY);

var container = document.body;
var moonFromJYDemo = document.getElementById("moonFromJY");

const classList = [
  "fullMoon",
  "mooncakeWithCat1",
  "mooncake",
  "rabbit",
  "mooncakeWithCat2",
];
// 监听点击事件
document.addEventListener("click", function (event) {
  const num = Math.floor(Math.random() * classList.length);
  var newMoonFromJY = moonFromJYDemo.cloneNode(true); // 创建新的月亮元素
  newMoonFromJY.style.left = event.clientX + "px"; // 设置月亮的水平位置
  newMoonFromJY.style.top = event.clientY + "px"; // 设置月亮的水平位置
  newMoonFromJY.style.display = "block";
  newMoonFromJY.classList.add(classList[num]);
  container.appendChild(newMoonFromJY); // 将月亮添加到容器中

  // 移除月亮
  setTimeout(function () {
    newMoonFromJY.remove();
  }, 2000);
});

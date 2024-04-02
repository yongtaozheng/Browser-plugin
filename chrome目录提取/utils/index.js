//json转为style样式
function obj2Style(obj) {
  const list = [];
  for (const key in obj) {
    list.push(`${key}:${obj[key]}`);
  }
  return list.join(";");
}

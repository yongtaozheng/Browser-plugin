const path = require("path");
const child_process = require("child_process");

async function npmInstall(options) {
  console.log(`正在更新依赖，请稍等……`);
  child_process.execSync("npm install", options);
}

async function init() {
  const list = ["./popup", "./panel", "./"];
  for (const item of list) {
    const cdPath = path.join(__dirname, item);
    const options = {
      cwd: cdPath,
    };
    await npmInstall(options);
  }
  console.log("初始化完成");
}
init();

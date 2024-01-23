const path = require("path");
const child_process = require("child_process");
const fs = require("fs-extra");
const inquirer = require("@jyeontu/j-inquirer");

const installOptions = [
  {
    type: "list",
    message: "是否更新依赖",
    name: "confirm",
    choices: ["是", "否"],
    default: "否",
  },
];
async function doInquirer(options) {
  const answers = await new inquirer(options).prompt();
  return answers;
}
async function npmInstall(options) {
  const cwd = path.join(options.cwd, "node_modules");
  if (fs.existsSync(cwd)) return;
  let answers = await doInquirer(installOptions);
  if (answers.confirm === "是") {
    console.log(`正在更新依赖，请稍等……`);
    child_process.execSync("npm install", options);
  }
}
async function buildPopup() {
  const cdPath = path.join(__dirname, "./popup");
  const options = {
    cwd: cdPath,
  };
  await npmInstall(options);
  child_process.execSync("npm run build", options);
}
async function buildPanel() {
  const cdPath = path.join(__dirname, "./panel");
  const options = {
    cwd: cdPath,
  };
  await npmInstall(options);
  child_process.execSync("npm run build", options);
}
async function reNameCss() {
  const cdPath = path.join(__dirname, "./panel/dist/css");
  const cssFiles = fs.readdirSync(`${cdPath}`);
  const oldName = path.join(__dirname, `./panel/dist/css/${cssFiles[0]}`);
  const newName = path.join(__dirname, `./panel/dist/css/panel.css`);
  fs.renameSync(oldName, newName);
}
async function editManifest() {
  const data = fs.readFileSync("manifest.json", "utf8");
  const jsonData = JSON.parse(data);
  const cdPath = path.join(__dirname, "./panel/dist/js");
  const jsFiles = fs.readdirSync(`${cdPath}`);
  const cdPath1 = path.join(__dirname, "./script");
  const jsFiles1 = fs.readdirSync(`${cdPath1}`);
  const web_accessible_resources = [
    ...jsFiles.map((file) => {
      return "panel/dist/js/" + file;
    }),
  ];
  web_accessible_resources.push(
    ...jsFiles1.map((file) => {
      return `script/${file}`;
    })
  );
  jsonData.web_accessible_resources[0].resources = [
    ...new Set(web_accessible_resources),
  ];
  const modifiedJsonData = JSON.stringify(jsonData, null, 2);
  fs.writeFileSync("manifest.json", modifiedJsonData, "utf-8");
}
async function editContentScript() {
  const cdPath = path.join(__dirname, "./panel/dist/js");
  const cdPath1 = path.join(__dirname, "./script");
  const jsFiles = fs.readdirSync(`${cdPath}`);
  const jsFiles1 = fs.readdirSync(`${cdPath1}`);
  const scriptUrlList = jsFiles.map((file) => {
    return `"panel/dist/js/${file}"`;
  });
  scriptUrlList.push(
    jsFiles1.map((file) => {
      return `"script/${file}"`;
    })
  );
  const text = `
const scriptUrlList = [${scriptUrlList}];
scriptUrlList.forEach(url=>{
    const s = document.createElement('script');
    s.src = chrome.runtime.getURL(url);
    s.setAttribute('type', 'text/javascript');
    s.onload = function() {
        this.remove();
    };
    (document.head || document.documentElement).appendChild(s);
})`;
  fs.writeFileSync("contentScript.js", text, "utf-8");
}
async function createDist() {
  fs.removeSync("dist");
  const cpFileList = [
    "panel/dist/",
    "popup/dist/",
    "manifest.json",
    "img",
    "bg.js",
    "contentScript.js",
    "myStyle.css",
    "script",
  ];
  for (const file of cpFileList) {
    fs.copySync(file, "dist/" + file);
  }
}
async function run() {
  console.log(`正在打包popup目录，请稍等……`);
  await buildPopup();
  console.log(`正在打包panel目录，请稍等……`);
  await buildPanel();
  await reNameCss();
  console.log(`正在生成manifest配置文件，请稍等……`);
  await editManifest();
  await editContentScript();
  console.log(`正在生成dist包，请稍等……`);
  await createDist();
  console.log(`打包完成`);
}
run();

import axios from "axios";
import myConfig from "../config/my.json";

const getUrlName = (url) => url.split("/").pop();
// 输出高亮请求传参
const outputRequestLog = (url, params) => {
  const reqUrl = getUrlName(url);
  console.log(
    `%c request %c ${reqUrl} %c`,
    "background:#858b9c ; padding: 2px; border-radius: 3px 0 0 3px;  color: #fff",
    "background:#0282cb ; padding: 2px; border-radius: 0 3px 3px 0;  color: #fff",
    "background:transparent",
    Object.assign({}, params)
  );
};
// 输出高亮响应数据
const outputResponseLog = (url, response) => {
  const reqUrl = getUrlName(url);
  console.log(
    `%c response %c ${reqUrl} %c`,
    "background:#41b883 ; padding: 2px; border-radius: 3px 0 0 3px;  color: #fff",
    "background:#0282cb ; padding: 2px; border-radius: 0 3px 3px 0;  color: #fff",
    "background:transparent",
    response
  );
};

class Http {
  // GET 请求
  static get(url, params) {
    outputRequestLog(url, params);
    return new Promise((resolve, reject) => {
      axios
        .get(url, {
          headers: {
            Authorization: `token ${myConfig.token}`,
          },
          params,
        })
        .then((response) => {
          outputResponseLog(url, response.data);
          resolve(response.data);
        })
        .catch((error) => {
          console.error(error);
          reject(error);
        });
    });
  }

  // POST 请求
  static post(url, data) {
    outputRequestLog(url, params);
    return new Promise((resolve, reject) => {
      axios
        .post(url, data)
        .then((response) => {
          outputResponseLog(url, response.data);
          resolve(response.data);
        })
        .catch((error) => {
          console.error(error);
          reject(error);
        });
    });
  }
}

export default Http;

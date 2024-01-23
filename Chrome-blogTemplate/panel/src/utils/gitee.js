import { mergeBookmarks } from "./chrome";
import myConfig from "../config/my.json";

export function getDecodedContent(content, needParse = true) {
  const decodedContent = atob(content); // 解码Base64编码的文件内容
  const decoder = new TextDecoder();
  const decodedData = decoder.decode(
    new Uint8Array([...decodedContent].map((char) => char.charCodeAt(0)))
  );
  if (!needParse) return decodedData;
  return JSON.parse(decodedData);
}

export async function fetchFileContent(apiUrl, accessToken = myConfig.token) {
  const response = await fetch(apiUrl, {
    headers: {
      Authorization: "token " + accessToken,
    },
  });
  const fileData = await response.json();
  return fileData;
}

export async function createFileInGitee(
  apiUrl,
  fileName,
  content,
  accessToken = myConfig.token,
  commitMessage = "新增模板"
) {
  try {
    apiUrl += `/${fileName}`;

    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json;charset=utf-8",
      Authorization: `token ${accessToken}`,
    };
    const encoder = new TextEncoder();
    const modifiedContent = encoder.encode(content);
    const encodedContent = btoa(
      String.fromCharCode.apply(null, new Uint8Array(modifiedContent))
    );

    const data = {
      access_token: accessToken,
      message: commitMessage,
      content: encodedContent,
    };

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(data),
    });

    if (response.ok) {
      const result = await response.json();
      alert("文件创建成功：", result);
      return true;
    } else {
      const error = await response.json();
      alert("文件创建失败：", error);
      return false;
    }
  } catch (error) {
    alert("请求失败：", error);
    return false;
  }
}

export async function deleteFileInGitee(
  apiUrl,
  fileName,
  sha,
  accessToken = myConfig.token,
  commitMessage = "删除模板"
) {
  try {
    apiUrl += `/${fileName}`;

    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json;charset=utf-8",
      Authorization: `token ${accessToken}`,
    };
    // 构建删除文件的数据
    const data = {
      message: commitMessage,
      sha,
    };

    // 发送删除文件的请求
    const deleteResponse = await fetch(apiUrl, {
      method: "DELETE",
      headers: headers,
      body: JSON.stringify(data),
    });

    if (deleteResponse.ok) {
      const result = await deleteResponse.json();
      alert("文件删除成功：", result);
      return true;
    } else {
      const error = await deleteResponse.json();
      alert("文件删除失败：", error);
      return false;
    }
  } catch (error) {
    alert("请求失败：", error);
    return false;
  }
}

export async function addFileContent(
  apiUrl,
  encodedContent,
  accessToken = myConfig.token
) {
  const commitData = {
    access_token: accessToken,
    content: encodedContent,
    message: "新增模板",
  };

  const putResponse = await fetch(apiUrl, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: "token " + accessToken,
    },
    body: JSON.stringify(commitData),
  });

  if (putResponse.ok) {
    alert("添加成功");
  } else {
    alert("添加失败");
  }
}

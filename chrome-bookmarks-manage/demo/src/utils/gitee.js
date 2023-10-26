import { mergeBookmarks } from "./chrome";

async function getDecodedContent(content) {
  const decodedContent = atob(content); // 解码Base64编码的文件内容
  const decoder = new TextDecoder();
  const decodedData = decoder.decode(
    new Uint8Array([...decodedContent].map((char) => char.charCodeAt(0)))
  );
  return JSON.parse(decodedData);
}

async function fetchFileContent(apiUrl, accessToken) {
  const response = await fetch(apiUrl, {
    headers: {
      Authorization: "token " + accessToken,
    },
  });
  const fileData = await response.json();
  return fileData;
}

async function putFileContent(apiUrl, accessToken, encodedContent, sha) {
  const commitData = {
    access_token: accessToken,
    content: encodedContent,
    message: "Modified file",
    sha: sha,
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
    alert("File modified successfully.");
  } else {
    alert("Failed to modify file.");
  }
}

export async function modifyFile(gitInfo, modifiedContent, isCover) {
  const accessToken = gitInfo.token;
  const apiUrl =
    "https://gitee.com/api/v5/repos/" +
    gitInfo.owner +
    "/" +
    gitInfo.repo +
    "/contents/" +
    gitInfo.filePath;

  try {
    const file = await fetchFileContent(apiUrl, accessToken);
    const fileContent = file.content || "";
    if (!isCover) {
      const content = await getDecodedContent(fileContent);
      modifiedContent = mergeBookmarks(content, modifiedContent);
    }
    modifiedContent = JSON.stringify(modifiedContent);
    const encoder = new TextEncoder();
    const data = encoder.encode(modifiedContent);
    const encodedContent = btoa(
      String.fromCharCode.apply(null, new Uint8Array(data))
    );

    await putFileContent(apiUrl, accessToken, encodedContent, file.sha);
  } catch (error) {
    alert("An error occurred:", error);
  }
}

export async function getFile(gitInfo) {
  const accessToken = gitInfo.token;
  const apiUrl =
    "https://gitee.com/api/v5/repos/" +
    gitInfo.owner +
    "/" +
    gitInfo.repo +
    "/contents/" +
    gitInfo.filePath;

  const file = await fetchFileContent(apiUrl, accessToken);
  const fileContent = file.content || "";
  const decodedContent = atob(fileContent); // 解码Base64编码的文件内容
  const decoder = new TextDecoder();
  const decodedData = decoder.decode(
    new Uint8Array([...decodedContent].map((char) => char.charCodeAt(0)))
  );
  return JSON.parse(decodedData);
}

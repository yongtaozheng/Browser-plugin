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
    message: "更新浏览器标签",
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
    alert("已成功上传");
  } else {
    alert("上传数据失败");
  }
}
async function createFileOnGitee(
  apiUrl,
  accessToken,
  fileContent,
  commitMessage = "更新浏览器标签"
) {
  const data = {
    content: fileContent, // 将文件内容转换为Base64编码
    message: commitMessage, // 提交信息
    branch: "master", // 指定分支，默认为master
    access_token: accessToken, // 你的Gitee Access Token
  };
  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `token ${accessToken}`,
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      const result = await response.json();
      console.log("File created successfully:", result);
      return result;
    } else {
      console.error("Failed to create file:", await response.json());
      throw new Error("Failed to create file");
    }
  } catch (error) {
    console.error("An error occurred:", error);
    throw error;
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
    modifiedContent = JSON.stringify(modifiedContent);
    const encoder = new TextEncoder();
    const data = encoder.encode(modifiedContent);
    const encodedContent = btoa(
      String.fromCharCode.apply(null, new Uint8Array(data))
    );
    if (!file.sha) await createFileOnGitee(apiUrl, accessToken, encodedContent);
    else await putFileContent(apiUrl, accessToken, encodedContent, file.sha);
  } catch (error) {
    console.log("%c Line:105 🥚 error", "color:#465975", error);
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
  try {
    const fileContent = file.content || "";
    const decodedContent = atob(fileContent); // 解码Base64编码的文件内容
    const decoder = new TextDecoder();
    const decodedData = decoder.decode(
      new Uint8Array([...decodedContent].map((char) => char.charCodeAt(0)))
    );
    return JSON.parse(decodedData);
  } catch (err) {
    return "";
  }
}
export async function checkFileExistenceOnGitee(gitInfo) {
  const { owner, repo, filePath } = gitInfo;
  const url = `https://gitee.com/api/v5/repos/${owner}/${repo}/contents/${filePath}`;
  try {
    const response = await fetch(url);
    if (response.status === 200) {
      // 文件存在
      return true;
    } else if (response.status === 404) {
      // 文件不存在
      return false;
    } else {
      // 其他 HTTP 错误
      throw new Error(`Failed to fetch file information: ${response.status}`);
    }
  } catch (error) {
    // 网络错误或其他异常
    console.error(
      "An error occurred while checking the file existence:",
      error
    );
    return null;
  }
}
export async function getGiteeList(gitInfo) {
  const { token: accessToken, owner, repo, dirPath } = gitInfo;
  try {
    const response = await fetch(
      `https://gitee.com/api/v5/repos/${owner}/${repo}/contents/${dirPath}`,
      {
        headers: {
          Authorization: `token ${accessToken}`,
        },
      }
    );

    if (response.ok) {
      const fileList = await response.json();
      return fileList.map((item) => item.name);
    } else {
      console.error(`Error: ${response.status}`);
      return null;
    }
  } catch (error) {
    console.error("Error:", error.message);
    return null;
  }
}

export const Repo_BaseUrl = "https://github.com/GroupMountain/BuildCache";
export const Cache_windows = "BuildCache-windows.zip";

import * as core from "@actions/core";
import * as os from "os";

function getReleaseBaseUrl(version) {
  if (version === "latest") {
    return `${Repo_BaseUrl}/releases/latest/download/`;
  } else {
    return `${Repo_BaseUrl}/releases/download/${version}/`;
  }
}

function getCacheUrl(version) {
  const baseUrl = getReleaseBaseUrl(version);
  const cacheName = Cache_windows;
  let cacheurl = baseUrl + cacheName; //TODO: add check
  core.info(`Found Cache, url: ${cacheurl}`);
  return cacheurl;
}

import * as exec from "@actions/exec";

//xmake show的输出是带颜色的，需要去掉
function stripAnsi(input) {
  return input.replace(
    /[\u001b\u009b][[()#;?]*(?:[0-?]*[ -/]*[@-~])|\[\d{1,2}m/g,
    "",
  );
}

async function getXmakeDir() {
  try {
    const { stdout } = await exec.getExecOutput("xmake", ["show"]);
    const cleanOutput = stripAnsi(stdout);
    const match = cleanOutput.match(/globaldir:\s*([^\r\n]+)/);
    if (match) {
      core.info(`Xmake global directory: ${match[1].trim()}`);
      return match[1].trim();
    } else {
      core.warning("Xmake global directory not found, use default path!");
      return "~/AppData/Local/.xmake";
    }
  } catch (error) {
    core.warning("Xmake command not found, use default path!");
    return "~/AppData/Local/.xmake";
  }
}

async function unzip7z(zipPath, destDir) {
  const args = ["x", zipPath, `-o${destDir}`, "-aoa"];
  return exec.exec("7z", args);
}

import * as tc from "@actions/tool-cache";

async function applyCache(cacheUrl, xmakeDir) {
  core.info(`Downloading cache from ${cacheUrl}`);
  try {
    const cachePath = await tc.downloadTool(cacheUrl);
    core.info(`Cache downloaded to ${cachePath}`);
    const extractedPath = await unzip7z(cachePath, xmakeDir);
    core.info(`Cache extracted to ${extractedPath}`);
    return true;
  } catch (error) {
    core.error(`Failed to download cache from ${cacheUrl}: ${error.message}`);
    return false;
  }
}

export async function run() {
  if (os.platform() === "win32" || os.platform() === "cygwin") {
    try {
      const xmakeDir = await getXmakeDir();
      const version = core.getInput("version");
      const cacheUrl = getCacheUrl(version);
      await applyCache(cacheUrl, xmakeDir);
    } catch (error) {
      core.error(`Failed to apply cache: ${error.message}`);
    }
  } else {
    core.error(`Unsupported platform: ${os.platform()}`);
  }
}

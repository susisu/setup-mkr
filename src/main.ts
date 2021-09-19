import * as childProcess from "child_process";
import * as os from "os";
import * as core from "@actions/core";
import * as tc from "@actions/tool-cache";
import { createDownloadSpec, createDownloadUrl } from "./download";
import { normalizeVersion } from "./version";

export async function run(): Promise<void> {
  try {
    const inputs = {
      version: core.getInput("version"),
    };
    core.info(`Setup mkr (version = ${inputs.version})`);

    const version = normalizeVersion(inputs.version);

    const toolName = "mkr";
    let cachedPath = tc.find(toolName, version);
    if (!cachedPath) {
      const downloadedPath = await download(version);
      const extractedPath = await extract(downloadedPath);
      cachedPath = await tc.cacheDir(extractedPath, toolName, version);
    }

    install(cachedPath);

    await check();
  } catch (err: unknown) {
    core.setFailed(String(err));
  }
}

async function download(version: string): Promise<string> {
  const spec = createDownloadSpec({ version, platform: os.platform(), arch: os.arch() });
  const downloadUrl = createDownloadUrl(spec);
  core.info(`Downloading from ${downloadUrl}...`);
  const downloadedPath = await tc.downloadTool(downloadUrl);
  return downloadedPath;
}

async function extract(path: string): Promise<string> {
  core.info("Extracting...");
  let extractedPath: string;
  if (path.endsWith(".tar.gz")) {
    extractedPath = await tc.extractTar(path);
  } else if (path.endsWith(".zip")) {
    extractedPath = await tc.extractZip(path);
  } else {
    throw new Error(`Unsupported archive type: ${path}`);
  }
  return extractedPath;
}

function install(path: string): void {
  core.info("Installing...");
  core.addPath(path);
}

async function check(): Promise<void> {
  const mkrVersion = await new Promise<string>((resolve, reject) => {
    childProcess.exec("mkr --version", (err, stdout) => {
      if (err) {
        reject(err);
      }
      resolve(stdout);
    });
  });
  core.info(mkrVersion);
}

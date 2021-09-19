import * as os from "os";
import * as core from "@actions/core";
import * as exec from "@actions/exec";
import * as tc from "@actions/tool-cache";
import { MkrSpec, createSpec, createDownloadUrl } from "./mkr";

export async function run(): Promise<void> {
  try {
    const inputs = {
      version: core.getInput("version"),
    };
    core.info(`Setup mkr (version = ${inputs.version})`);

    const spec = createSpec({
      version: inputs.version,
      platform: os.platform(),
      arch: os.arch(),
    });

    const toolName = "mkr";
    let cachedPath = tc.find(toolName, spec.version);
    if (!cachedPath) {
      const [downloadedPath, ext] = await download(spec);
      const extractedPath = await extract(downloadedPath, ext);
      cachedPath = await tc.cacheDir(extractedPath, toolName, spec.version);
    }

    install(cachedPath);

    await check();
  } catch (err: unknown) {
    core.setFailed(String(err));
  }
}

async function download(spec: MkrSpec): Promise<[path: string, ext: string]> {
  const { url, ext } = createDownloadUrl(spec);
  core.info(`Downloading from ${url}...`);
  const downloadedPath = await tc.downloadTool(url);
  return [downloadedPath, ext];
}

async function extract(path: string, ext: string): Promise<string> {
  core.info("Extracting...");
  let extractedPath: string;
  if (ext === "tar.gz") {
    extractedPath = await tc.extractTar(path);
  } else if (ext === "zip") {
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
  let mkrVersion = "";
  await exec.exec("mkr", ["--version"], {
    listeners: {
      stdout: data => {
        mkrVersion += data.toString();
      },
    },
  });
  core.info(mkrVersion);
}

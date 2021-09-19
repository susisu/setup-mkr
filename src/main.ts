import * as os from "os";
import * as core from "@actions/core";
import * as tc from "@actions/tool-cache";
import { createDownloadSpec, createDownloadUrl } from "./download";

export async function run(): Promise<void> {
  try {
    const version = core.getInput("version");
    core.info(`Setup mkr (version = ${version})`);

    core.startGroup("download");
    const downloadResult = await download({ version });
    core.endGroup();

    core.startGroup("extract");
    await extract({ path: downloadResult.path });
    core.endGroup();

    core.startGroup("install");
    await install();
    core.endGroup();
  } catch (err: unknown) {
    core.setFailed(String(err));
  }
}

type DownloadParams = Readonly<{
  version: string;
}>;

type DownloadResult = Readonly<{
  path: string;
  version: string;
}>;

async function download(params: DownloadParams): Promise<DownloadResult> {
  const spec = createDownloadSpec({
    version: params.version,
    platform: os.platform(),
    arch: os.arch(),
  });
  const downloadUrl = createDownloadUrl(spec);

  core.info(`Downloading ${downloadUrl}`);
  const downloadPath = await tc.downloadTool(downloadUrl);

  return {
    path: downloadPath,
    version: spec.version,
  };
}

type ExtractParams = Readonly<{
  path: string;
}>;

type ExtractResult = Readonly<{
  path: string;
}>;

async function extract(params: ExtractParams): Promise<ExtractResult> {
  core.info(`Extracting ${params.path}`);
  let extractPath: string;
  if (params.path.endsWith(".tar.gz")) {
    extractPath = await tc.extractTar(params.path);
  } else if (params.path.endsWith(".zip")) {
    extractPath = await tc.extractZip(params.path);
  } else {
    throw new Error(`Unsupported archive: ${params.path}`);
  }
  return {
    path: extractPath,
  };
}

async function install(): Promise<void> {}

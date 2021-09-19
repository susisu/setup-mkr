import * as os from "os";
import * as core from "@actions/core";
import * as tc from "@actions/tool-cache";
import { createDownloadSpec, createDownloadUrl } from "./download";

export async function run(): Promise<void> {
  try {
    const version = core.getInput("version");
    core.info(`Setup mkr (version = ${version})`);

    core.startGroup("download");
    await download({ version });
    core.endGroup();

    core.startGroup("extract");
    await extract();
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

async function extract(): Promise<void> {}

async function install(): Promise<void> {}

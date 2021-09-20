import * as path from "path";
import * as core from "@actions/core";
import * as exec from "@actions/exec";
import * as tc from "@actions/tool-cache";

export type Inputs = Readonly<{
  version: string;
  token: string;
}>;

export async function run(): Promise<void> {
  try {
    const inputs: Inputs = {
      version: core.getInput("mkr-version"),
      token: core.getInput("token"),
    };
    core.info(`Setup mkr (mkr-version = '${inputs.version}')`);

    const version = getVersion(inputs);
    const token = getToken(inputs);

    const release = await findRelease(version, token);
    core.info(`Use mkr ${release.version}`);

    const file = release.files[0];
    const toolPath = await download(release, file);
    install(toolPath, file);

    await check();
    core.debug("Done");
  } catch (err: unknown) {
    core.setFailed(String(err));
  }
}

export function getVersion(inputs: Inputs): string {
  if (inputs.version === "" || inputs.version === "latest") {
    return "<1.0.0";
  }
  return inputs.version;
}

export function getToken(inputs: Inputs): string | undefined {
  return inputs.token || undefined;
}

async function findRelease(version: string, token: string | undefined): Promise<tc.IToolRelease> {
  core.debug(`Find release for version '${version}'`);
  const manifest = await tc.getManifestFromRepo("susisu", "mkr-versions", token, "main");
  const release = await tc.findFromManifest(version, true, manifest);
  if (!release) {
    throw new Error(`Release not fouond for version '${version}'`);
  }
  return release;
}

async function download(release: tc.IToolRelease, file: tc.IToolReleaseFile): Promise<string> {
  const toolName = "mkr";

  let toolPath = tc.find(toolName, release.version);
  if (toolPath) {
    core.debug(`Cache found at '${toolPath}'`);
  } else {
    core.info(`Downloading... ${file.download_url}`);
    const filePath = await tc.downloadTool(file.download_url);

    core.info("Extracting...");
    let extractedPath: string;
    if (file.filename.endsWith(".tar.gz")) {
      extractedPath = await tc.extractTar(filePath);
    } else if (file.filename.endsWith(".zip")) {
      extractedPath = await tc.extractZip(filePath);
    } else {
      throw new Error(`Unsupported archive '${file.filename}'`);
    }

    toolPath = await tc.cacheDir(extractedPath, toolName, release.version);
  }

  return toolPath;
}

function install(toolPath: string, file: tc.IToolReleaseFile): void {
  // The executable is placed under the directory whose name is the same as the archive file name
  // excluding the file extension.
  const binDirPath = path.join(toolPath, file.filename.split(".")[0]);
  core.debug(`Add '${binDirPath}' to PATH`);
  core.addPath(binDirPath);
}

async function check(): Promise<void> {
  core.debug("Exec 'mkr --version'");
  await exec.exec("mkr", ["--version"]);
}

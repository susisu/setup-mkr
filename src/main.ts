import * as os from "os";
import * as path from "path";
import * as core from "@actions/core";
import * as exec from "@actions/exec";
import * as hc from "@actions/http-client";
import * as tc from "@actions/tool-cache";
import { MkrSpec, ArchiveInfo, createSpec, getArchiveInfo } from "./mkr";
import { unreachable } from "./utils";

export async function run(): Promise<void> {
  try {
    const inputs = {
      version: core.getInput("mkr-version"),
    };
    core.info(`Setup mkr (mkr-version = '${inputs.version}')`);

    const spec = await getSpec(inputs.version);
    const archive = getArchiveInfo(spec);

    const toolName = "mkr";
    let cachedDir = tc.find(toolName, spec.version);
    if (cachedDir) {
      core.debug(`Use cache in '${cachedDir}'`);
    } else {
      const archivePath = await download(archive);
      const extractedDir = await extract(archivePath, archive);
      cachedDir = await tc.cacheDir(extractedDir, toolName, spec.version);
    }

    install(cachedDir, archive);

    await check();

    core.debug("Done");
  } catch (err: unknown) {
    core.setFailed(String(err));
  }
}

async function getSpec(version: string): Promise<MkrSpec> {
  let resolvedVersion: string;
  if (version === "" || version === "latest") {
    core.debug("Resolve latest version");
    // In the future, the latest release may not be the latest version...
    const client = new hc.HttpClient(undefined, undefined, { allowRedirects: false });
    const resp = await client.get("https://github.com/mackerelio/mkr/releases/latest");
    const location = resp.message.headers["location"];
    if (!location) {
      throw new Error("Failed to find the latest version");
    }
    const r = /^https:\/\/github.com\/mackerelio\/mkr\/releases\/tag\/(.+)$/.exec(location);
    if (!r) {
      throw new Error(`Failed to parse the latest version: ${location}`);
    }
    resolvedVersion = r[1];
  } else {
    resolvedVersion = version;
  }
  const spec = createSpec({
    version: resolvedVersion,
    platform: os.platform(),
    arch: os.arch(),
  });
  return spec;
}

async function download(archive: ArchiveInfo): Promise<string> {
  core.info(`Downloading... ${archive.url}`);
  return tc.downloadTool(archive.url);
}

async function extract(archivePath: string, archive: ArchiveInfo): Promise<string> {
  core.info("Extracting...");
  switch (archive.type) {
    case "tar.gz":
      return tc.extractTar(archivePath);
    case "zip":
      return tc.extractZip(archivePath);
    default:
      return unreachable(archive.type);
  }
}

function install(dir: string, archive: ArchiveInfo): void {
  const binDir = path.join(dir, archive.binDir);
  core.debug(`Add '${binDir}' to PATH`);
  core.addPath(binDir);
}

async function check(): Promise<void> {
  core.debug("Exec 'mkr --version'");
  await exec.exec("mkr", ["--version"]);
}

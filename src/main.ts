import * as os from "os";
import * as path from "path";
import * as core from "@actions/core";
import * as exec from "@actions/exec";
import * as hc from "@actions/http-client";
import * as tc from "@actions/tool-cache";
import { MkrSpec, ArchiveInfo, createSpec, getArchiveInfo } from "./mkr";

export async function run(): Promise<void> {
  try {
    const inputs = {
      version: core.getInput("version"),
    };
    core.info(`Setup mkr (version = '${inputs.version}')`);

    const spec = await getSpec(inputs.version);
    const archive = getArchiveInfo(spec);

    const toolName = "mkr";
    let cachedDir = tc.find(toolName, spec.version);
    if (!cachedDir) {
      const archivePath = await download(archive);
      const extractedDir = await extract(archivePath, archive);
      cachedDir = await tc.cacheDir(extractedDir, toolName, spec.version);
    }

    install(cachedDir, archive);

    await check();
  } catch (err: unknown) {
    core.setFailed(String(err));
  }
}

async function getSpec(version: string): Promise<MkrSpec> {
  let resolvedVersion: string;
  if (version === "" || version === "latest") {
    // get the latest version tag
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
  core.info(`Downloading from ${archive.url}`);
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
  core.info("Installing...");
  core.addPath(path.join(dir, archive.binDir));
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

function unreachable(x: never): never {
  throw new Error(`reached: ${JSON.stringify(x)}`);
}

import * as core from "@actions/core";

export async function run(): Promise<void> {
  try {
    const version = core.getInput("version");
    core.info(`Setup mkr (version = ${version})`);

    core.startGroup("download");
    await download();
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

async function download(): Promise<void> {}

async function extract(): Promise<void> {}

async function install(): Promise<void> {}

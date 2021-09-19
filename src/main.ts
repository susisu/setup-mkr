import * as core from "@actions/core";

async function run(): Promise<void> {
  const version = core.getInput("version");
  core.info(`Setup mkr (version = ${version})`);
}

run().catch(err => {
  core.setFailed(String(err));
});

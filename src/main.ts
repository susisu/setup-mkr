import * as core from "@actions/core";

async function run(): Promise<void> {
  const version = core.getInput("version");
  core.setOutput("version", version);
}

run().catch(err => {
  core.setFailed(String(err));
});

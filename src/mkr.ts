type MkrPlatform = "linux" | "darwin";
type MkrArch = "386" | "amd64" | "arm" | "arm64";
export type MkrSpec = Readonly<{
  version: string;
  platform: MkrPlatform;
  arch: MkrArch;
}>;

type CreateSpecParams = Readonly<{
  version: string;
  platform: NodeJS.Platform;
  arch: string;
}>;

export function createSpec(params: CreateSpecParams): MkrSpec {
  return {
    version: normalizeVersion(params.version),
    platform: normalizePlatform(params.platform),
    arch: normalizeArch(params.arch),
  };
}

function normalizeVersion(version: string): string {
  const result = /^v?(\d+\.\d+\.\d+)$/.exec(version);
  if (!result) {
    throw new Error(`Unsupported version format: ${version}`);
  }
  return result[1];
}

function normalizePlatform(platform: NodeJS.Platform): MkrPlatform {
  switch (platform) {
    case "linux":
      return "linux";
    case "darwin":
      return "darwin";
    default:
      throw new Error(`Unsupported platform: ${platform}`);
  }
}

function normalizeArch(arch: string): MkrArch {
  switch (arch) {
    case "arm":
      return "arm";
    case "arm64":
      return "arm64";
    case "ia32":
      return "386";
    case "x64":
      return "amd64";
    default:
      throw new Error(`Unsupported arch: ${arch}`);
  }
}

export function createDownloadUrl(spec: MkrSpec): string {
  const ext = {
    linux: "tar.gz",
    darwin: "zip",
  }[spec.platform];
  return `https://github.com/mackerelio/mkr/releases/download/v${spec.version}/mkr_${spec.platform}_${spec.arch}.${ext}`;
}

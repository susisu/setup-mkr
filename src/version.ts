export function normalizeVersion(version: string): string {
  const result = /^v?(\d+\.\d+\.\d+)$/.exec(version);
  if (!result) {
    throw new Error(`Unsupported version format: ${version}`);
  }
  return result[1];
}

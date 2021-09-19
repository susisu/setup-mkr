export function unreachable(x: never): never {
  throw new Error(`reached: ${JSON.stringify(x)}`);
}

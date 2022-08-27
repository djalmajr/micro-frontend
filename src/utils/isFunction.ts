export function isFunction(value: unknown): value is Fn<[...unknown[]], unknown> {
  return typeof value === "function";
}

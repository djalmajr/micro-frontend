export const proxify = <T extends object>(value: T) => {
  return new Proxy(value, { get: (target, method) => target[method].bind(target) });
};

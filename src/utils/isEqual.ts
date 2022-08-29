import { isObject } from "./isObject.js";
import { size } from "./size.js";

const { keys } = Object;

export const isEqual = (source: unknown, target: unknown): boolean => {
  if (!isObject(source) || !isObject(target)) {
    return source === target;
  }

  if (size(source) !== size(target)) {
    return false;
  }

  return keys(source).every((key: string): boolean => {
    if (
      isObject(source[key as keyof typeof source]) &&
      isObject(target[key as keyof typeof target])
    ) {
      return isEqual(
        source[key as keyof typeof source],
        target[key as keyof typeof target],
      );
    }

    return source[key as keyof typeof source] === target[key as keyof typeof target];
  });
};

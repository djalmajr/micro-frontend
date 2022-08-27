import { isFunction } from "./isFunction.js";
import { isObject } from "./isObject.js";
import { parseJSON } from "./parseJSON.js";
import { proxify } from "./proxify.js";
import { typeOf } from "./typeOf.js";

const { addEventListener, dispatchEvent } = proxify(document);

export const handler = (callbackOrName: Fn<[unknown], unknown> | string) => {
  const callback = (key: string, value?: unknown) => {
    const detail = { key, value };

    if (typeof callbackOrName === "function") {
      callbackOrName(detail);
    } else {
      dispatchEvent(new CustomEvent(`${callbackOrName}:update`, { detail }));
    }
  };

  return {
    get(obj: object, prop: string) {
      if (prop === "_isProxy") {
        return true;
      }

      const d = Object.getOwnPropertyDescriptor(obj, prop);

      if (isObject(obj[prop]) && !obj[prop]._isProxy && d.writable) {
        obj[prop] = new Proxy(obj[prop], handler(callbackOrName));
      }

      return obj[prop];
    },

    set(obj: object, prop: string, value: unknown) {
      if (obj[prop] !== value) {
        obj[prop] = value;
        callback(prop, value);
      }

      return true;
    },

    deleteProperty(obj: object, prop: string) {
      delete obj[prop];
      callback(prop);
      return true;
    },
  };
};

export const createStore = (nameOrInit: string | object, init: object) => {
  const hasName = typeOf(nameOrInit) === "string";
  const listeners = [];

  init = <object>(hasName ? init : nameOrInit) || {};
  nameOrInit = (hasName && nameOrInit) || "store";

  const subscribe = (listener: Fn<[...unknown[]], unknown>) => {
    if (!listeners.includes(listener)) {
      listeners.push(listener);
    }

    return () => {
      const idx = listeners.findIndex((l) => l === listener);

      idx !== -1 && listeners.splice(idx, 1);
    };
  };

  const store = new Proxy(
    Object.assign(init, { subscribe }),
    handler(<string>nameOrInit),
  );

  for (const prop in init) {
    const d = Object.getOwnPropertyDescriptor(init, prop);

    if (d.get && d.configurable) {
      Object.defineProperty(init, prop, {
        get: d.get.bind(store),
        configurable: false,
      });
    } else if (isFunction(init[prop])) {
      Object.defineProperty(init, prop, {
        value: init[prop].bind(store),
        configurable: false,
        writable: false,
      });
    }
  }

  addEventListener(`${nameOrInit}:update`, () => {
    const state = parseJSON(
      Object.keys(init).reduce((res, key) => {
        const d = Object.getOwnPropertyDescriptor(init, key);

        if (!isFunction(d.value) && d.writable) {
          res[key] = store[key];
        }

        return res;
      }, {}),
    );

    listeners.forEach((fn) => fn(state));
  });

  return store;
};

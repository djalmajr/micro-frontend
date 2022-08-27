import { html, render } from "uhtml";
import { camelCase } from "../utils/camelCase.js";
import { handler } from "../utils/createStore.js";
import { kebabCase } from "../utils/kebabCase.js";
import { parseJSON } from "../utils/parseJSON.js";
import { typeOf } from "../utils/typeOf.js";
import { useSheet } from "../utils/useSheet.js";

const parse = {
  attr(val: string) {
    return val === "" || parseJSON(val);
  },

  prop(val: string) {
    return typeof val === "boolean" ? (val ? "" : null) : String(val);
  },
};

const options = {
  characterData: true,
  childList: true,
  subtree: true,
};

export { html, render };

export class BaseElement extends HTMLElement {
  #mounted = false;
  #nextTickId?: number;

  #observer = new MutationObserver((m) => {
    console.log(m);
  });

  props = {};
  state = {};
  slots = {} as Obj<Node[]>;

  constructor() {
    super();
    const { styles } = <Obj>this.constructor;
    styles && useSheet(styles, document);
  }

  connectedCallback() {
    super.connectedCallback?.();

    this.state = new Proxy(this.state, handler(this.#render));
    this.props = new Proxy(this.props, handler(this.#render));
    this.#mounted = true;

    for (const key in this.props) {
      Object.defineProperty(this, key, {
        enumerable: true,
        configurable: true,
        get: () => this.props[key],
        set: (value) => {
          const name = kebabCase(key);
          const prop = parse.attr(this.getAttribute(name));
          const { observedAttributes } = <any>this.constructor;

          if (observedAttributes?.includes(name) && value !== prop) {
            ["null", "undefined"].includes(typeOf(value))
              ? this.removeAttribute(name)
              : this.setAttribute(name, parse.prop(value));
          }

          this.props[key] = value;
        },
      });
    }

    this.#observer.observe(this, options);
    this.#update();
    this.#render();
  }

  disconnectedCallback() {
    super.disconnectedCallback?.();
    this.#observer.disconnect();
  }

  attributeChangedCallback(key: string, old: string | null, val: string | null) {
    super.attributeChangedCallback?.(key, old, val);

    if (!this.#mounted) {
      queueMicrotask(() => this.attributeChangedCallback(key, old, val));
      return;
    }

    const prop = camelCase(key);

    if (this.hasOwnProperty(prop)) {
      this[prop] = parse.attr(val);
    }

    this.#render();
  }

  render() {
    return html``;
  }

  #render = () => {
    if (!this.isConnected) return;

    if (this.#nextTickId) {
      window.cancelAnimationFrame(this.#nextTickId);
    }

    this.#nextTickId = window.requestAnimationFrame(() => {
      render(this, this.render());
    });
  };

  #update() {
    Array.from(this.childNodes).forEach((node: HTMLElement) => {
      const name = node.getAttribute?.("slot") || "default";

      this.slots[name] ||= [];
      this.slots[name].push(node);
    });
  }
}

import { html, render, type Renderable } from "uhtml";
import { camelCase } from "../utils/camelCase.js";
import { handler } from "../utils/createStore.js";
import { kebabCase } from "../utils/kebabCase.js";
import { parseJSON } from "../utils/parseJSON.js";
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
  static shadowDOM = false;

  #mounted = false;
  #nextTickId?: number;
  #unsubscribe?: () => void;

  #observer = new MutationObserver((arr) => {
    this.#update(arr.reduce((r, m) => r.concat(...(<Obj>m).addedNodes), []));
  });

  props = {};
  state = {};
  slots = {} as Obj<Node[]>;

  constructor() {
    super();

    const { shadowDOM, styles } = <Obj>this.constructor;

    shadowDOM && this.attachShadow({ mode: "open" });
    styles && (this.#unsubscribe = useSheet(styles, this.$el));
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
          const prop = parse.attr(this.attr(name));
          const { observedAttributes } = <Obj>this.constructor;

          if (observedAttributes?.includes(name) && value !== prop) {
            this.attr(name, parse.prop(value));
          }

          this.props[key] = value;
        },
      });
    }

    this.#observer.observe(this, options);
    this.#update(Array.from(this.childNodes));
  }

  disconnectedCallback() {
    super.disconnectedCallback?.();
    this.#observer.disconnect();
    this.#unsubscribe?.();
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
  }

  // DOM

  get $el() {
    return this.shadowRoot || this;
  }

  $: HTMLElement["querySelector"] = (selector) => {
    return this.$el.querySelector(selector);
  };

  $$: HTMLElement["querySelector"] = (selector) => {
    return this.$el.querySelectorAll(selector);
  };

  attr(name: string, value?: string | null) {
    if (value == null) {
      this.removeAttribute(name);
    } else {
      this.setAttribute(name, value);
    }

    return this.getAttribute(name);
  }

  has(name: string) {
    return this.hasAttribute(name);
  }

  // Events

  emit(name: string, detail: unknown) {
    const options = { bubbles: true, composed: true, detail };

    return this.dispatchEvent(new CustomEvent(name, options));
  }

  on: HTMLElement["addEventListener"] = (name, listener, options) => {
    this.addEventListener(name, listener, options);
  };

  off: HTMLElement["addEventListener"] = (name, listener, options) => {
    this.removeEventListener(name, listener, options);
  };

  // Renderer

  render(): Renderable {
    return null;
  }

  #render = () => {
    if (!this.isConnected || !this.render?.()) return;

    if (this.#nextTickId) {
      window.cancelAnimationFrame(this.#nextTickId);
    }

    this.#nextTickId = window.requestAnimationFrame(() => {
      render(this, html.node`${this.render()}`);
    });
  };

  #update(nodes: Node[]) {
    if (nodes.length) {
      for (const name in this.slots) {
        for (const node of this.slots[name]) {
          if (this.contains(node)) return;
        }
      }

      this.slots = nodes.reduce((res, node: HTMLElement) => {
        const name = node.getAttribute?.("slot") || "default";
        res[name] ||= [];
        res[name].push(node);
        return res;
      }, {});

      this.#render();
    }
  }
}

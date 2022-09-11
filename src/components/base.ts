import { html, render, type Renderable } from "uhtml";
import { handler } from "../utils/createStore.js";
import { isEqual } from "../utils/isEqual.js";
import { parseJSON } from "../utils/parseJSON.js";
import { typeOf } from "../utils/typeOf.js";
import { useSheet } from "../utils/useSheet.js";

interface Converter {
  from(value: string, type: BaseProp["type"]): unknown;
  to(value: unknown, type: BaseProp["type"]): string;
}

interface BaseProp {
  attribute?: boolean;
  converter?: Converter["from"] | Converter;
  reflect?: boolean;
  type?: Constructor;
}

const convert: Converter = {
  from(value, Ctor: BaseProp["type"] = String) {
    const type = typeOf(new Ctor());

    if (["array", "object"].includes(type)) {
      return parseJSON(value);
    }

    if (type === "boolean") {
      return value != null;
    }

    return new Ctor(value);
  },

  to(value, Ctor: BaseProp["type"] = String): string {
    return new Ctor(value) as string;
  },
};

export { html, render };

export class BaseElement extends HTMLElement {
  static shadowDOM = false;

  #mounted = false;
  #nextTickId?: number;
  #observer?: MutationObserver;
  #props = {};
  #unsheet?: () => void;

  properties?: Obj<BaseProp>;
  slots = {} as Obj<Node[]>;
  state = {};

  constructor() {
    super();
    const { shadowDOM, styles } = <Obj>this.constructor;
    shadowDOM && this.attachShadow({ mode: "open" });
    styles && (this.#unsheet = useSheet(styles, this.$el));
  }

  connectedCallback() {
    super.connectedCallback?.();

    this.#mounted = true;
    this.#props = new Proxy(this.#init(), handler(this.forceUpdate));
    this.state = new Proxy(this.state, handler(this.forceUpdate));

    if (!this.shadowRoot) {
      this.#observer = new MutationObserver(this.#onChange);
      this.#observer.observe(this, { characterData: true, childList: true });
      this.#update(Array.from(this.childNodes));
      Object.defineProperty(this, "textContent", {
        set: (value) => {
          const frag = document.createDocumentFragment();
          frag.replaceChildren(document.createTextNode(value));
          this.#update(Array.from(frag.childNodes));
        },
      });
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback?.();
    this.#observer?.disconnect();
    this.#unsheet?.();
  }

  attributeChangedCallback(key: string, old: string | null, val: string | null) {
    super.attributeChangedCallback?.(key, old, val);

    !this.#mounted && this.#init();

    for (const prop in this.properties) {
      const { attribute, converter = convert, type } = this.properties[prop];
      const attr = typeof attribute === "string" ? attribute : prop.toLowerCase();

      if (attr === key) {
        const from = this[prop];

        this[prop] =
          typeof converter === "function"
            ? converter(val, type)
            : converter.from(val, type);

        this.emit("update", { [prop]: from });
      }
    }

    this.forceUpdate();
  }

  #init() {
    const props = {};

    for (const prop in this.properties) {
      Object.defineProperty(this, prop, {
        enumerable: true,
        configurable: true,
        get: () => this.#props[prop],
        set: (value) => {
          const {
            attribute,
            converter = convert,
            reflect,
            type = String,
          } = this.properties[prop];

          if (attribute !== false && reflect) {
            const isFn = typeof converter === "function";
            const attr = typeof attribute === "string" ? attribute : prop.toLowerCase();
            const prev = isFn
              ? converter(this.attr(attr), type)
              : converter.from(this.attr(attr), type);

            if (!isEqual(value, prev)) {
              this.attr(attr, isFn ? String(value) : converter.to(value, type));
            }
          }

          this.#props[prop] = value;
        },
      });

      props[prop] = this[prop] ?? null;
    }

    return props;
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
    return this.dispatchEvent(new CustomEvent(name, { detail }));
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

  forceUpdate = () => {
    if (!this.isConnected) return;

    if (this.#nextTickId) {
      window.cancelAnimationFrame(this.#nextTickId);
    }

    this.#nextTickId = window.requestAnimationFrame(() => {
      render(this.$el, this.render());
    });
  };

  #onChange = (arr: MutationRecord[]) => {
    this.#update(arr.reduce((r, m) => r.concat(...(<Obj>m).addedNodes), []));
  };

  #update(nodes: Node[]) {
    if (nodes.length) {
      if (Object.keys(this.slots).length) {
        for (const node of nodes) {
          if (this.contains(node)) return;
        }
      }

      this.slots = nodes.reduce((res, node: HTMLElement) => {
        const name = node.getAttribute?.("slot") || "default";
        res[name] ||= [];
        res[name].push(node);
        return res;
      }, {});

      this.forceUpdate();
    }
  }
}

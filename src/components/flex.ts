import { Intent, Size } from "../constants.js";

type Aliases = Obj<string[] | ((value: string | null, attrs: string[]) => string)>;

const { from, isArray } = Array;

const { assign, keys, values } = Object;

const colors = {
  bg: ["background"],
  shadow: ["box-shadow"],
  elevation: ["box-shadow"],
};

const flex = {
  align: ["align-items"],
  justify: ["justify-content"],
  "flex-dir": ["flex-direction"],
};

const layout = {
  d: ["display"],
  w: ["width"],
  h: ["height"],
  dir: ["direction"],
  size: ["width", "height"],
  radius: ["border-radius"],
  "min-w": ["min-width"],
  "max-w": ["max-width"],
  "min-h": ["min-height"],
  "max-h": ["max-height"],
};

const position = {
  pos: ["position"],
  t: ["top"],
  l: ["left"],
  r: ["right"],
  b: ["bottom"],
  z: ["z-index"],
};

const spaces = {
  m: ["margin"],
  mt: ["margin-top"],
  ml: ["margin-left"],
  mr: ["margin-right"],
  mb: ["margin-bottom"],
  mx: ["margin-left", "margin-right"],
  my: ["margin-bottom", "margin-top"],
  p: ["padding"],
  pt: ["padding-top"],
  pl: ["padding-left"],
  pr: ["padding-right"],
  pb: ["padding-bottom"],
  px: ["padding-left", "padding-right"],
  py: ["padding-bottom", "padding-top"],
  "margin-x": ["margin-left", "margin-right"],
  "margin-y": ["margin-bottom", "margin-top"],
  "padding-x": ["padding-left", "padding-right"],
  "padding-y": ["padding-bottom", "padding-top"],
};

const pseudos: Record<string, string> = {
  first: "first-of-type",
  last: "last-of-type",
};

const options = {
  attributes: true,
  attributeOldValue: true,
};

const aliases = assign({}, colors, flex, layout, position, spaces) as Aliases;

const split = (attr: string) => {
  return attr.split(/-(active|focus|hover|first|last)$/).filter(Boolean);
};

const isRoot = (node: Node) => {
  return [Node.DOCUMENT_FRAGMENT_NODE, Node.DOCUMENT_NODE].includes(node.nodeType);
};

const allowed = (attr: string) => {
  const [name] = split(attr);

  return keys(aliases).includes(name) || CSS.supports(name, "var(--a)");
};

const generate = (size: string) => /* css */ `
  m-flex[space=${size}]:not([column]):not([reverse]):not([flex-dir*='column']):not([flex-direction*='column']) > *:not([hidden]):not(:first-child),
  m-flex[as][space=${size}]:not([column]):not([reverse]):not([flex-dir*='column']):not([flex-direction*='column']) > :first-child > *:not([hidden]):not(:first-child) {
    margin-left: calc(var(--m-spacing-${size}) * calc(1 - 0));
    margin-right: calc(var(--m-spacing-${size}) * 0);
  }
  m-flex[space=${size}][reverse]:not([column]) > *:not([hidden]):not(:first-child),
  m-flex[space=${size}][flex-dir='horizontal-reverse'] > *:not([hidden]):not(:first-child),
  m-flex[space=${size}][flex-direction='horizontal-reverse'] > *:not([hidden]):not(:first-child),
  m-flex[as][space=${size}][reverse]:not([column]) > :first-child > *:not([hidden]):not(:first-child),
  m-flex[as][space=${size}][flex-dir='horizontal-reverse'] > :first-child > *:not([hidden]):not(:first-child),
  m-flex[as][space=${size}][flex-direction='horizontal-reverse'] > :first-child > *:not([hidden]):not(:first-child) {
    margin-left: calc(var(--m-spacing-${size}) * calc(1 - 1));
    margin-right: calc(var(--m-spacing-${size}) * 1);
  }
  m-flex[space=${size}][column]:not([reverse]) > *:not([hidden]):not(:first-child),
  m-flex[space=${size}][flex-dir='column'] > *:not([hidden]):not(:first-child),
  m-flex[space=${size}][flex-direction='column'] > *:not([hidden]):not(:first-child),
  m-flex[as][space=${size}][column]:not([reverse]) > :first-child > *:not([hidden]):not(:first-child),
  m-flex[as][space=${size}][flex-dir='column'] > :first-child > *:not([hidden]):not(:first-child),
  m-flex[as][space=${size}][flex-direction='column'] > :first-child > *:not([hidden]):not(:first-child) {
    margin-top: calc(var(--m-spacing-${size}) * calc(1 - 0));
    margin-bottom: calc(var(--m-spacing-${size}) * 0);
  }
  m-flex[space=${size}][column][reverse] > *:not([hidden]):not(:first-child),
  m-flex[space=${size}][flex-dir='column-reverse'] > *:not([hidden]):not(:first-child),
  m-flex[space=${size}][flex-direction='column-reverse'] > *:not([hidden]):not(:first-child),
  m-flex[as][space=${size}][column][reverse] > :first-child > *:not([hidden]):not(:first-child),
  m-flex[as][space=${size}][flex-dir='column-reverse'] > :first-child > *:not([hidden]):not(:first-child),
  m-flex[as][space=${size}][flex-direction='column-reverse'] > :first-child > *:not([hidden]):not(:first-child) {
    margin-top: calc(var(--m-spacing-${size}) * calc(1 - 1));
    margin-bottom: calc(var(--m-spacing-${size}) * 1);
  }
`;

const flexCss = /* css */ `
  m-flex, m-flex[as] > :first-child { display: flex; }
  m-flex[as] { display: contents; }
  m-flex[hidden] { display: none; }
  m-flex[column]:not([reverse]), m-flex[as][column]:not([reverse]) > :first-child { flex-direction: column; }
  m-flex[column][reverse], m-flex[as][column][reverse] > :first-child { flex-direction: column-reverse; }
  m-flex[reverse]:not([column]), m-flex[as][reverse]:not([column]) > :first-child { flex-direction: row-reverse; }
  m-flex[reverse][wrap], m-flex[as][reverse][wrap] > :first-child { flex-wrap: wrap-reverse; }
  m-flex[center], m-flex[as][center] > :first-child { align-items: center; justify-content: center }
  m-flex[nowrap], m-flex[as][nowrap] > :first-child { flex-wrap: nowrap; }
  m-flex[wrap], m-flex[as][wrap] > :first-child { flex-wrap: wrap; }
`;

const sheet = new CSSStyleSheet();

const findRule = (s: string) => {
  return from(sheet.cssRules).find((r: CSSStyleRule) => r.selectorText === s);
};

sheet.replaceSync(values(Size).map(generate).concat(flexCss).join(""));

export class Flex extends HTMLElement {
  static get observedAttributes(): string[] {
    return [
      "as",
      "class",
      "center",
      "column",
      "disabled",
      "hidden",
      "nowrap",
      "reverse",
      "space",
      "style",
      "wrap",
    ];
  }

  #root: HTMLElement = this;

  #observer = new MutationObserver(() => this.#updateStyle());

  get as(): string | null {
    return this.getAttribute("as");
  }

  get attrs(): string[] {
    return (<any>this).constructor.observedAttributes || [];
  }

  connectedCallback(): void {
    this.#init();
    this.#observer.observe(this, options);
    this.#updateStyle();
  }

  attributeChangedCallback(key: string): void {
    switch (key) {
      case "as":
        queueMicrotask(() => this.#updateRoot());
        break;
    }
  }

  disconnectedCallback(): void {
    this.#observer?.disconnect();
    this.#observer = null;
  }

  #init(): void {
    let node = <Document>this.parentNode;

    while (!isRoot(node)) {
      node = <Document>(node.parentNode || document);
    }

    const sheets = node.adoptedStyleSheets || [];

    if (!sheets.includes(sheet)) {
      node.adoptedStyleSheets = [...sheets, sheet];
    }
  }

  #parse(attr: string, value: string | null): string | null {
    const [name] = split(attr);
    const prefix = this.tagName.toLowerCase().split("-")[0];
    const rxSize = new RegExp(`(${values(Size).join("|")})(?!-)`, "g");
    const rxIntent = new RegExp(`(${values(Intent).join("|")})(?!-)`, "g");

    if (value && (value.match(rxSize) || !CSS.supports(name, value))) {
      const val = value.replace(".", "-");
      const npx = Number.isNaN(Number(value)) ? "" : `${value}px`;

      if (name.match(/^bg$/) || name.match(/(background|color)/)) {
        return `var(--${prefix}-color-${val})`;
      }

      if (name.match(/shadow/)) {
        return `var(--${prefix}-shadow-${val})`;
      }

      if (name.match(/radius/)) {
        return npx || `var(--${prefix}-radius-${val})`;
      }

      if (name.match(/^border(-(top|left|right|bottom))?$/)) {
        return val
          .replace(rxIntent, `var(--${prefix}-color-$1)`)
          .replace(/(\w+-\d+)/, `var(--${prefix}-color-$1)`);
      }

      if (name.match(/(width|height|margin|padding|top|left|right|bottom)/)) {
        return npx || val.replace(rxSize, `var(--${prefix}-spacing-$1)`);
      }

      if (name.match(/^font-size$/)) {
        return npx || val.replace(rxSize, `var(--${prefix}-font-$1)`);
      }
    }

    return value;
  }

  #moveAttrs(source: HTMLElement, target: HTMLElement): void {
    for (const k of (source as any).style) {
      target.style[k] = source.style[k];
    }

    const iter = (source as any).classList.values();
    let next = iter.next();

    while (!next.done) {
      target.classList.add(next.value);
      next = iter.next();
    }

    source.removeAttribute("class");
    source.removeAttribute("style");

    // Remaining attributes
    source
      .getAttributeNames()
      .filter((key: string) => !allowed(key) && !this.attrs.includes(key))
      .forEach((key: string) => {
        target.setAttribute(key, source.getAttribute(key) as string);
        source.removeAttribute(key);
      });
  }

  #updateStyle(): void {
    this.getAttributeNames()
      .filter((key) => allowed(key) && !this.attrs.includes(key))
      .forEach((attr, _, attrs) => {
        const [name, pseudo] = split(attr);
        const state = pseudo ? `:${pseudos[pseudo] || pseudo}` : "";
        const value = this.getAttribute(attr);
        const query = this.as
          ? `m-flex[as][${attr}="${value}"]${state} > :first-child`
          : `m-flex[${attr}="${value}"]${state}`;

        if (!findRule(query)) {
          const parse = (key: string) => this.#parse(key, value);
          const toCSS = (key: string) => `${key}:${parse(key)}`;
          const prop = aliases[name];
          const text = keys(aliases).includes(name)
            ? `${isArray(prop) ? prop.map(toCSS).join(";") : prop(parse(name), attrs)}`
            : toCSS(name);

          sheet.insertRule(`${query} { ${text}; }`.replace(/;+/, ";"));
        }
      });

    this.as && queueMicrotask(() => this.#moveAttrs(this, this.#root));
  }

  #updateRoot(): void {
    const frag = document.createDocumentFragment();

    Array.from(this.#root.childNodes).forEach((n) => frag.append(n));

    if (this.as) {
      const root = document.createElement(this.as);
      root.append(frag);
      if (this === this.#root) this.appendChild(root);
      else this.#root.parentNode?.replaceChild(root, this.#root);
      this.#root = root;
      this.#moveAttrs(this, root);
    } else {
      this.#moveAttrs(this.#root, this);
      this.#root.parentNode?.replaceChild(frag, this.#root);
      this.#root = this;
    }

    this.#updateStyle();
  }
}

customElements.define("m-flex", Flex);

declare global {
  interface HTMLElementTagNameMap {
    ["m-flex"]: Flex;
  }
}

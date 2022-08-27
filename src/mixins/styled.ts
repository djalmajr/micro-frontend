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

const pseudos: Obj<string> = {
  first: "first-of-type",
  last: "last-of-type",
};

const options = { attributes: true, attributeOldValue: true };

const aliases = assign({}, colors, flex, layout, position, spaces) as Aliases;

const split = (attr: string) => {
  return attr.split(/-(active|focus|hover|first|last)$/).filter(Boolean);
};

const stringify = (stylesheet: CSSStyleSheet) => {
  return Array.from(stylesheet.cssRules)
    .map((rule) => rule.cssText || "")
    .join("\n");
};

const isRoot = (node: Node) => {
  return [Node.DOCUMENT_FRAGMENT_NODE, Node.DOCUMENT_NODE].includes(node.nodeType);
};

const sheet = new CSSStyleSheet();

export interface StyledMixinInterface {
  get as(): string;
  get attrs(): string[];
  supports(val: string): boolean;
}

export function StyledMixin<T extends Constructor<HTMLElement>>(
  Base: T,
  config?: { ghost?: boolean },
): Constructor<StyledMixinInterface> & T {
  const { ghost = true } = config || {};

  return class Styled extends Base {
    #observer = new MutationObserver(() => this.#update());

    #sheet = [].concat((<any>this).constructor.styles)[0] || sheet;

    get as(): string {
      return this.getAttribute("as");
    }

    get attrs() {
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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(...args: any[]) {
      super(...args);
      this.addEventListener("updatesheet", () => this.#update());
    }

    connectedCallback() {
      super.connectedCallback?.();
      this.#init();
      this.#update();
      this.#observer.observe(this, options);
    }

    disconnectedCallback() {
      super.disconnectedCallback?.();
      this.#observer.disconnect();
    }

    supports(attr: string) {
      const [name] = split(attr);

      return keys(aliases).includes(name) || CSS.supports(name, "var(--a)");
    }

    #findRule(s: string) {
      return from(this.#sheet.cssRules).find((r: CSSStyleRule) => r.selectorText === s);
    }

    #init() {
      let target = this.parentNode;

      while (!isRoot(target)) {
        target = target.parentNode || document;
      }

      const sheets = (<Obj>target).adoptedStyleSheets || [];
      const tag = this.tagName.toLowerCase();
      const prefix = tag.split("-")[0];
      const suffix = ghost ? "> :first-child" : "";
      const display = ghost ? "flow-root" : "flex";

      const spaces = (size: string) => /* css */ `
        ${tag}[space=${size}]:not([column]):not([reverse]):not([flex-dir*='column']):not([flex-direction*='column']) ${suffix} > *:not([hidden]):not(:first-child),
        ${tag}[as][space=${size}]:not([column]):not([reverse]):not([flex-dir*='column']):not([flex-direction*='column']) > :first-child > *:not([hidden]):not(:first-child) {
          margin-left: calc(var(--${prefix}-spacing-${size}) * calc(1 - 0));
          margin-right: calc(var(--${prefix}-spacing-${size}) * 0);
        }
        ${tag}[space=${size}][reverse]:not([column]) ${suffix} > *:not([hidden]):not(:first-child),
        ${tag}[space=${size}][flex-dir='horizontal-reverse'] ${suffix} > *:not([hidden]):not(:first-child),
        ${tag}[space=${size}][flex-direction='horizontal-reverse'] ${suffix} > *:not([hidden]):not(:first-child),
        ${tag}[as][space=${size}][reverse]:not([column]) > :first-child > *:not([hidden]):not(:first-child),
        ${tag}[as][space=${size}][flex-dir='horizontal-reverse'] > :first-child > *:not([hidden]):not(:first-child),
        ${tag}[as][space=${size}][flex-direction='horizontal-reverse'] > :first-child > *:not([hidden]):not(:first-child) {
          margin-left: calc(var(--${prefix}-spacing-${size}) * calc(1 - 1));
          margin-right: calc(var(--${prefix}-spacing-${size}) * 1);
        }
        ${tag}[space=${size}][column]:not([reverse]) ${suffix} > *:not([hidden]):not(:first-child),
        ${tag}[space=${size}][flex-dir='column'] ${suffix} > *:not([hidden]):not(:first-child),
        ${tag}[space=${size}][flex-direction='column'] ${suffix} > *:not([hidden]):not(:first-child),
        ${tag}[as][space=${size}][column]:not([reverse]) > :first-child > *:not([hidden]):not(:first-child),
        ${tag}[as][space=${size}][flex-dir='column'] > :first-child > *:not([hidden]):not(:first-child),
        ${tag}[as][space=${size}][flex-direction='column'] > :first-child > *:not([hidden]):not(:first-child) {
          margin-top: calc(var(--${prefix}-spacing-${size}) * calc(1 - 0));
          margin-bottom: calc(var(--${prefix}-spacing-${size}) * 0);
        }
        ${tag}[space=${size}][column][reverse] ${suffix} > *:not([hidden]):not(:first-child),
        ${tag}[space=${size}][flex-dir='column-reverse'] ${suffix} > *:not([hidden]):not(:first-child),
        ${tag}[space=${size}][flex-direction='column-reverse'] ${suffix} > *:not([hidden]):not(:first-child),
        ${tag}[as][space=${size}][column][reverse] > :first-child > *:not([hidden]):not(:first-child),
        ${tag}[as][space=${size}][flex-dir='column-reverse'] > :first-child > *:not([hidden]):not(:first-child),
        ${tag}[as][space=${size}][flex-direction='column-reverse'] > :first-child > *:not([hidden]):not(:first-child) {
          margin-top: calc(var(--${prefix}-spacing-${size}) * calc(1 - 1));
          margin-bottom: calc(var(--${prefix}-spacing-${size}) * 1);
        }
      `;

      const common = /* css */ `
        ${tag} { display: ${display}; }
        ${tag} ${suffix} { display: flex; }
        ${tag}[as] > :first-child { display: flex; }
        ${tag}[hidden] { display: none; }
        ${tag}[column]:not([reverse]) ${suffix}, ${tag}[as][column]:not([reverse]) > :first-child { flex-direction: column; }
        ${tag}[column][reverse] ${suffix}, ${tag}[as][column][reverse] > :first-child { flex-direction: column-reverse; }
        ${tag}[reverse]:not([column]) ${suffix}, ${tag}[as][reverse]:not([column]) > :first-child { flex-direction: row-reverse; }
        ${tag}[reverse][wrap] ${suffix}, ${tag}[as][reverse][wrap] > :first-child { flex-wrap: wrap-reverse; }
        ${tag}[center] ${suffix}, ${tag}[as][center] > :first-child { align-items: center; justify-content: center }
        ${tag}[nowrap] ${suffix}, ${tag}[as][nowrap] > :first-child { flex-wrap: nowrap; }
        ${tag}[wrap] ${suffix}, ${tag}[as][wrap] > :first-child { flex-wrap: wrap; }
      `;

      const styles = values(Size).map(spaces).concat(common).join("");

      if (!this.#findRule(`${tag}[hidden]`)) {
        this.#sheet.replaceSync(stringify(this.#sheet) + styles);
      }

      if (!sheets.includes(this.#sheet)) {
        (<Obj>target).adoptedStyleSheets = [...sheets, this.#sheet];
      }
    }

    #parse(attr: string, value: string | null) {
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

    #update() {
      this.getAttributeNames()
        .filter((key) => this.supports(key) && !this.attrs.includes(key))
        .forEach((attr, _, attrs) => {
          const [name, pseudo] = split(attr);
          const tag = this.tagName.toLowerCase();
          const value = this.getAttribute(attr);
          const state = pseudo ? `:${pseudos[pseudo] || pseudo}` : "";
          const suffix = ghost ? "> :first-child" : "";
          const query = this.as
            ? `${tag}[as][${attr}="${value}"]${state} > :first-child`
            : `${tag}[${attr}="${value}"]${state} ${suffix}`;

          if (!this.#findRule(query)) {
            const parse = (key: string) => this.#parse(key, value);
            const toCSS = (key: string) => `${key}:${parse(key)}`;
            const prop = aliases[name];
            const text = keys(aliases).includes(name)
              ? `${isArray(prop) ? prop.map(toCSS).join(";") : prop(parse(name), attrs)}`
              : toCSS(name);

            this.#sheet.insertRule(`${query} { ${text}; }`.replace(/;+/, ";"));
          }
        });

      this.dispatchEvent(new Event("sheetupdate"));
    }
  };
}

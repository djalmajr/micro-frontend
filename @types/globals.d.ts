declare module "@/*";
declare module "@utils/*";

declare module "*.css" {
  const value: CSSStyleSheet;

  export default value;
}

// eslint-disable-next-line @typescript-eslint/ban-types
declare type Constructor<T = {}> = new (...args: any[]) => T;

declare type Fn<A extends unknown[], R = unknown> = (...args: A) => R;

declare type Obj<T = any> = Record<PropertyKey, T>;

declare type ValueOf<T> = T[keyof T];

interface Document {
  adoptedStyleSheets: CSSStyleSheet[];
}

interface ShadowRoot {
  adoptedStyleSheets: CSSStyleSheet[];
}

interface CSSStyleSheet {
  replaceSync(css: string): void;
}

interface HTMLElement {
  attributeChangedCallback(key: string, old: string | null, val: string | null): void;
  connectedCallback(): void;
  disconnectedCallback(): void;
}

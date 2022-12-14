import { Styled } from "../mixins/styled.js";

const styles = new CSSStyleSheet();

export class Flex extends Styled(HTMLElement) {
  static styles = styles;

  #root: Flex | HTMLElement = this;

  constructor() {
    super();
    this.addEventListener("sheetupdate", () => this.#move(this, this.#root));
  }

  attributeChangedCallback(key: string, old: string | null, val: string | null): void {
    super.attributeChangedCallback?.(key, old, val);

    switch (key) {
      case "as":
      case "data-as":
        queueMicrotask(() => this.#update());
        break;
    }
  }

  #move(source: HTMLElement, target: HTMLElement): void {
    if (source.isEqualNode(target)) return;

    for (const k of (<Obj>source).style) {
      target.style[k] = source.style[k];
    }

    for (let v, it = (<Obj>source).classList.values(); (v = it.next().value); ) {
      target.classList.add(v[1]);
    }

    source.removeAttribute("class");
    source.removeAttribute("style");

    // Remaining attributes
    source
      .getAttributeNames()
      .filter((key) => !this.supports(key) && !this.attrs.includes(key))
      .forEach((key) => {
        target.setAttribute(key, source.getAttribute(key) as string);
        source.removeAttribute(key);
      });
  }

  #update() {
    const frag = document.createDocumentFragment();

    Array.from(this.#root.childNodes).forEach((n) => frag.append(n));

    if (this.as) {
      const root = document.createElement(this.as);
      root.append(frag);
      if (this === this.#root) this.appendChild(root);
      else this.#root.parentNode?.replaceChild(root, this.#root);
      this.#root = root;
      this.#move(this, root);
    } else {
      this.#move(this.#root, this);
      this.#root.parentNode?.replaceChild(frag, this.#root);
      this.#root = this;
    }

    queueMicrotask(() => this.dispatchEvent(new Event("updatesheet")));
  }
}

customElements.define("m-flex", Flex);

declare global {
  interface HTMLElementTagNameMap {
    ["m-flex"]: Flex;
  }
}

import bootstrap from "../bootstrap.js";
import { Styled } from "../mixins/styled.js";
import styles from "./async.css" assert { type: "css" };
import { BaseElement } from "./base.js";

const create = (tag: string, attrs?: object) => {
  const node = document.createElement(tag);
  for (const k in attrs) node.setAttribute(k, attrs[k]);
  return node;
};

export interface Async {
  url: string;
}

export class Async extends Styled(BaseElement) {
  static styles = styles;

  static shadowDOM = true;

  static get observedAttributes() {
    return ["url"];
  }

  properties = {
    url: { type: String },
  };

  state = {
    loaded: false,
  };

  connectedCallback() {
    super.connectedCallback();
    bootstrap(this.$el);
    this.#import();
    this.on("updated", this.#import);
  }

  #import = () => {
    this.$el.firstChild?.remove();
    this.$el.append(create("m-spinner", { m: "auto" }));

    import(this.url).then((m) => {
      this.$el.firstChild?.remove();
      this.$el.append(create("div", { class: "root" }));
      m.default(this.$el.firstChild);
    });
  };
}

customElements.define("m-async", Async);

declare global {
  interface HTMLElementTagNameMap {
    ["m-async"]: Async;
  }
}

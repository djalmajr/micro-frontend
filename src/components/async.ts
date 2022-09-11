import { Styled } from "../mixins/styled.js";
import { createNode } from "../utils/createNode.js";
import styles from "./async.css" assert { type: "css" };
import { BaseElement } from "./base.js";

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
    this.#import();
    this.on("update", this.#import);
  }

  #import() {
    this.$el.replaceChildren(createNode("m-spinner", { m: "auto" }));

    import(this.url).then((m) => {
      this.$el.replaceChildren(createNode("div", { class: "root" }));
      m.default(this.$el.firstChild);
    });
  }
}

customElements.define("m-async", Async);

declare global {
  interface HTMLElementTagNameMap {
    ["m-async"]: Async;
  }
}

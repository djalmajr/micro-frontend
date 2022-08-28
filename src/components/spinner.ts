import { Styled } from "../mixins/styled.js";
import { BaseElement } from "./base.js";
import styles from "./spinner.css" assert { type: "css" };

export class Spinner extends Styled(BaseElement) {
  static styles = styles;

  static get observedAttributes() {
    return ["color", "hidden", "size"];
  }

  attributeChangedCallback(key: string, old: string, val: string): void {
    super.attributeChangedCallback(key, old, val);

    if (key === "color") {
      const color = getComputedStyle(this).getPropertyValue("--color");

      this.style.setProperty("--color", CSS.supports("color", val) ? val : color);
    }
  }
}

customElements.define("m-spinner", Spinner);

declare global {
  interface HTMLElementTagNameMap {
    ["m-spinner"]: Spinner;
  }
}

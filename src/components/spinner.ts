import { html, LitElement, PropertyValues } from "lit";
import { customElement, property } from "lit/decorators.js";
import styles from "./spinner.css" assert { type: "css" };
import { Size } from "../constants.js";

@customElement("m-spinner")
export class Spinner extends LitElement {
  static styles = styles;

  @property({ type: String })
  color = "#0f7bc2";

  @property({ type: Boolean })
  hidden = false;

  @property({ type: String })
  size?: ValueOf<typeof Size>;

  constructor() {
    super();
    this.style.setProperty("--color", this.color);
  }

  updated(props: PropertyValues) {
    if (props.has("color")) {
      const color = getComputedStyle(this).getPropertyValue("--color");

      this.style.setProperty("--color", this.color || color);
    }
  }

  render() {
    return html`<div class="spinner" />`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    ["m-spinner"]: Spinner;
  }
}

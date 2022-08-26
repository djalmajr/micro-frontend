import { html, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { StyledMixin } from "../mixins/styled.js";
import styles from "./async.css" assert { type: "css" };
import "./spinner.js";

@customElement("m-async")
export class Async extends StyledMixin(LitElement) {
  static styles = styles;

  @property({ type: String })
  url?: string;

  @state()
  loaded = false;

  firstUpdated() {
    console.log(this.url);

    import(this.url).then((m) => {
      this.loaded = true;
      m.default(this.shadowRoot.querySelector(".r00t"));
    });
  }

  render() {
    return html`<div class="r00t"><m-spinner ?hidden=${this.loaded} /></div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    ["m-async"]: Async;
  }
}

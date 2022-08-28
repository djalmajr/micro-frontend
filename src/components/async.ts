import { html, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import styles from "./async.css" assert { type: "css" };
import bootstrap from "../bootstrap.js";

@customElement("m-async")
export class Async extends LitElement {
  static styles = styles;

  @property({ type: String })
  url?: string;

  @state()
  loaded = false;

  connectedCallback() {
    super.connectedCallback();
    bootstrap(this.shadowRoot);
  }

  firstUpdated() {
    import(this.url).then((m) => {
      this.loaded = true;
      m.default(this.shadowRoot.querySelector(".root"));
    });
  }

  render() {
    return html`<div class="root"><m-spinner ?hidden=${this.loaded} /></div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    ["m-async"]: Async;
  }
}

import "@micro/components/button.js";
import "@micro/components/flex.js";
import { BaseElement, html } from "@micro/components/base.js";
import { Styled } from "@micro/mixins/styled.js";
import styles from "./card.css" assert { type: "css" };

class Card extends Styled(BaseElement) {
  static styles = styles;

  render() {
    const { slots } = this;

    return html`
      <header>${slots.header}</header>
      <main>${slots.default}</main>
      <footer>${slots.footer}</footer>
    `;
  }
}

customElements.define("m-card", Card);

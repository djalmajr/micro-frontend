import "@micro/components/button.js";
import "@micro/components/flex.js";
import { useSheet } from "@micro/utils/useSheet.js";
import { signal } from "@preact/signals";
import { html } from "htm/preact";
import { render } from "preact";
import styles from "./index.css" assert { type: "css" };

const count = signal(0);
const dec = () => count.value--;
const inc = () => count.value++;

function App() {
  return html`
    <m-flex column class="app" color="purple.600">
      <m-flex as="h3" mt="0">Preact App</m-flex>
      <m-flex align="center" space="medium">
        <m-button center color="purple" width="10" onclick=${dec}>-</m-button>
        <m-flex d="inline" center font-size="large">${count}</m-flex>
        <m-button center color="purple" width="10" onclick=${inc}>+</m-button>
      </m-flex>
    </m-flex>
  `;
}

export default function (element) {
  useSheet(styles, element);
  render(html`<${App} />`, element);
}

import { useSheet } from "@micro/utils/useSheet.js";
import { html } from "htm/preact";
import { render } from "preact";
import { useState } from "preact/hooks";
import styles from "./index.css" assert { type: "css" };

function App() {
  const [count, setCount] = useState(0);

  return html`
    <m-flex column class="app" color="purple.600">
      <m-flex as="h3" mt="0">Preact App</m-flex>
      <m-flex align="center" space="medium">
        <m-button
          center
          color="purple"
          width="10"
          onclick="${() => setCount((s) => s - 1)}"
        >
          -
        </m-button>
        <m-flex d="inline" center font-size="large">${count}</m-flex>
        <m-button
          center
          color="purple"
          width="10"
          onclick="${() => setCount((s) => s + 1)}"
        >
          +
        </m-button>
      </m-flex>
    </m-flex>
  `;
}

export default function (element) {
  useSheet(styles, element);
  render(html`<${App} />`, element);
}

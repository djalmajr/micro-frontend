import "@micro/components/button.js";
import "@micro/components/flex.js";
import { useSheet } from "@micro/utils/useSheet.js";
import { html } from "htm/react";
import { useState } from "react";
import { render } from "react-dom";
import styles from "./index.css" assert { type: "css" };

function App() {
  const [count, setCount] = useState(0);
  const dec = () => setCount((s) => s - 1);
  const inc = () => setCount((s) => s + 1);

  return html`
    <m-flex column class="app" color="blue.600">
      <m-flex as="h3" mt="0">React App</m-flex>
      <m-flex align="center" space="medium">
        <m-button center color="blue" width="10" onClick=${dec}>-</m-button>
        <m-flex d="inline" center font-size="large">${count}</m-flex>
        <m-button center color="blue" width="10" onClick=${inc}>+</m-button>
      </m-flex>
    </m-flex>
  `;
}

export default function (element) {
  useSheet(styles, element);
  render(html`<${App} />`, element);
}

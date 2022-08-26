import { useSheet } from "@micro/utils/useSheet.js";
import { html } from "htm/preact";
import { render } from "preact";
import { useState } from "preact/hooks";
import styles from "./index.css" assert { type: "css" };

function App() {
  const [count, setCount] = useState(0);

  return html`
    <div class="app">
      <h3 style="margin-top: 0">Preact App</h3>
      <button onclick="${() => setCount((s) => s - 1)}">-</button>
      <span>${count}</span>
      <button onclick="${() => setCount((s) => s + 1)}">+</button>
    </div>
  `;
}

export default function (element) {
  useSheet(styles, element);
  render(html`<${App} />`, element);
}

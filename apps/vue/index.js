import "@micro/components/button.js";
import "@micro/components/flex.js";
import { useSheet } from "@micro/utils/useSheet.js";
import htm from "htm";
import { createApp, h } from "vue";
import styles from "./index.css" assert { type: "css" };

const html = htm.bind(h);

/**
 * @param {HTMLElement} element
 */
export default function (element) {
  useSheet(styles, element);

  const app = createApp({
    data() {
      return {
        count: 0,
      };
    },
    methods: {
      inc() {
        this.count++;
      },
      dec() {
        this.count--;
      },
    },
    render() {
      return html`
        <m-flex column class="app" color="green.600">
          <m-flex data-as="h3" mt="0">Vue App</m-flex>
          <m-flex align="center" space="medium">
            <m-button center color="green" width="10" onClick=${this.dec}>-</m-button>
            <m-flex d="inline" center font-size="large">${this.count}</m-flex>
            <m-button center color="green" width="10" onClick=${this.inc}>+</m-button>
          </m-flex>
        </m-flex>
      `;
    },
  });

  app.mount(element);
}

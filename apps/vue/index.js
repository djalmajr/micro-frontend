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
        show: true,
      };
    },
    methods: {
      inc() {
        this.count++;
      },
      dec() {
        this.count--;
      },
      toggle() {
        this.show = !this.show;
      },
    },
    render() {
      return html`
        <m-flex column class="app" color="green.600">
          <m-flex font-size="1.2rem" font-weight="600" mb="medium" onclick=${this.toggle}>
            Vue App
          </m-flex>
          <m-flex align="center" space="medium">
            <m-button center color="green" width="10" onClick=${this.dec}>-</m-button>
            <m-flex d="inline" center font-size="large">${this.count}</m-flex>
            <m-button center color="green" width="10" onClick=${this.inc}>
              ${this.show ? "✕" : "+"}
            </m-button>
          </m-flex>
        </m-flex>
      `;
    },
  });

  app.mount(element);
}

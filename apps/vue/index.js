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
        duration: 15 * 1000,
        elapsed: 0,
      };
    },
    created() {
      let lastTime = performance.now();

      const update = () => {
        const time = performance.now();

        this.elapsed += Math.min(time - lastTime, this.duration - this.elapsed);
        lastTime = time;
        this.handle = requestAnimationFrame(update);
      };

      update();
    },
    unmounted() {
      cancelAnimationFrame(this.handle);
    },
    methods: {
      changeDuration(evt) {
        this.duration = evt.target.value;
      },
      reset() {
        this.elapsed = 0;
      },
    },
    render() {
      return html`
        <div class="app" ref="app">
          <h3 style="margin-top: 0">Vue 3 App</h3>
          <label>
            Elapsed Time:
            <progress .value="${this.elapsed / this.duration}" />
          </label>
          <div>${(this.elapsed / 1000).toFixed(1)}s</div>
          <div>
            Duration:
            <input
              min="1"
              max="30000"
              type="range"
              .value="${this.duration}"
              .onchange=${this.changeDuration}
            />
            ${(this.duration / 1000).toFixed(1)}s
          </div>
          <button onclick="${this.reset}">Reset</button>
        </div>
      `;
    },
  });

  app.mount(element);
}

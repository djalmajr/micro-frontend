import "@/components/card.js";
import "@micro/components/async.js";
import "@micro/components/flex.js";
import { signal } from "@preact/signals";
import { html } from "htm/preact";

const count = signal(0);

(function update() {
  count.value++;
  setTimeout(update, 1000);
})();

export const App = () => {
  return html`
    <m-flex column padding="medium" space="medium">
      <m-card margin-right="auto">
        <m-flex as="strong" margin="0" slot="header">Card Header</m-flex>
        Counter: ${count}
      </m-card>
      <m-async url="/apps/react/index.js" />
      <m-async url="/apps/preact/index.js" />
      <m-async url="/apps/vue/index.js" />
    </m-flex>
  `;
};

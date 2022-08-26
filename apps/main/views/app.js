import { html } from "htm/preact";

export const App = () => {
  return html`
    <m-flex column padding="medium" space="medium">
      <m-flex as="h1" m="0">Hello</m-flex>
      <m-async url="/apps/preact/index.js" />
      <m-async url="/apps/vue/index.js" />
    </m-flex>
  `;
};

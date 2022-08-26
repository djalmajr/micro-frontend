import { html } from "htm/preact";
import { render } from "preact";
import { App } from "~/views/app.js";

render(html`<${App} />`, document.querySelector("#r00t"));

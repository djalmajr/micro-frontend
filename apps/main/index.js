import { App } from "@/views/app.js";
import { html } from "htm/preact";
import { render } from "preact";

render(html`<${App} />`, document.querySelector("#r00t"));

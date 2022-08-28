import bootstrap from "@micro/bootstrap.js";
import { html } from "htm/preact";
import { render } from "preact";
import { App } from "~/views/app.js";

bootstrap();
render(html`<${App} />`, document.querySelector("#r00t"));

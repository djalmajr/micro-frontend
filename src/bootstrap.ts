import loader from "uce-loader";
import { useSheet } from "./utils/useSheet.js";

const sheet = new CSSStyleSheet();

sheet.replaceSync(/* css */ `
  *:not(:defined) {
    display: inline-block;
    overflow: hidden;
    opacity: 0.5;
    position: relative;
    transition: display ease-in-out;
  }

  *:not(:defined):after {
    content: "";
    animation: shimmer 2s infinite linear;
    background: linear-gradient(to right, #eff1f3 4%, #e2e2e2 25%, #eff1f3 36%);
    background-size: 1000px 100%;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }

  @keyframes shimmer {
    0% {
      background-position: -1000px 0;
    }

    100% {
      background-position: 1000px 0;
    }
  }
`);

export default function (container?: Document | ShadowRoot) {
  useSheet(sheet, container);

  loader({
    container,
    on(tag: string) {
      if (!tag.match(/^(m-)(.*)/)) return;

      const dir = import.meta.url.replace(/\/bootstrap.js$/, "");
      const name = tag.replace(/^m-/, "");

      document.head.append(
        Object.assign(document.createElement("script"), {
          src: `${dir}/components/${name}.js`,
          type: "module",
        }),
      );
    },
  });
}

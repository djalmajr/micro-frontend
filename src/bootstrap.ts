import loader from "uce-loader";

loader({
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

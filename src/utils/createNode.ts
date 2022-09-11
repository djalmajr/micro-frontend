export const createNode = (tag: string, attrs?: object) => {
  const node = document.createElement(tag);
  for (const k in attrs) node.setAttribute(k, attrs[k]);
  return node;
};

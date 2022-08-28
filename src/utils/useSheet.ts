export function useSheet(
  sheets: CSSStyleSheet | CSSStyleSheet[],
  target: Document | ShadowRoot | HTMLElement = document,
) {
  let node = <Document>target;
  const styles = [].concat(sheets);

  while (![Node.DOCUMENT_FRAGMENT_NODE, Node.DOCUMENT_NODE].includes(node.nodeType)) {
    node = <Document>(node.parentNode || document);
  }

  styles.forEach((sheet: CSSStyleSheet) => {
    if (!node.adoptedStyleSheets?.includes(sheet)) {
      node.adoptedStyleSheets = [...(node.adoptedStyleSheets || []), sheet];
    }
  });

  return () => {
    node.adoptedStyleSheets.forEach((sheet, idx, arr) => {
      if (styles.includes(sheet)) arr.splice(idx, 1);
    });
  };
}

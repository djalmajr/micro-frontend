export function useSheet(sheet: CSSStyleSheet, target: Document | ShadowRoot = document) {
  while (![Node.DOCUMENT_FRAGMENT_NODE, Node.DOCUMENT_NODE].includes(target.nodeType)) {
    target = <any>target.parentNode || document;
  }

  if (!target.adoptedStyleSheets.includes(sheet)) {
    target.adoptedStyleSheets = [...target.adoptedStyleSheets, sheet];
  }
}

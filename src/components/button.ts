import { BaseElement, html } from "./base.js";
import { Intent, Size } from "../constants.js";
import { Styled } from "../mixins/styled.js";

const sizes = Object.values(Size);

const colors = [
  { bgColor: "text" },
  { bgColor: "red", intent: "danger" },
  { bgColor: "blue", intent: "info" },
  { bgColor: "green", intent: "success" },
  { bgColor: "orange", intent: "warning" },
  { bgColor: "primary", intent: "primary" },
  { bgColor: "amber", color: "amber" },
  { bgColor: "blue-gray", color: "blue-gray" },
  { bgColor: "blue", color: "blue" },
  { bgColor: "brown", color: "brown" },
  { bgColor: "cyan", color: "cyan" },
  { bgColor: "deep-orange", color: "deep-orange" },
  { bgColor: "deep-purple", color: "deep-purple" },
  { bgColor: "fuchsia", color: "fuchsia" },
  { bgColor: "gray", color: "gray" },
  { bgColor: "green", color: "green" },
  { bgColor: "indigo", color: "indigo" },
  { bgColor: "light-blue", color: "light-blue" },
  { bgColor: "light-green", color: "light-green" },
  { bgColor: "lime", color: "lime" },
  { bgColor: "orange", color: "orange" },
  { bgColor: "pink", color: "pink" },
  { bgColor: "purple", color: "purple" },
  { bgColor: "red", color: "red" },
  { bgColor: "teal", color: "teal" },
  { bgColor: "yellow", color: "yellow" },
];

const color = ({ bgColor, color, intent }: Obj<string>) => {
  const prefix = intent ? `[intent="${intent}"]` : color ? `[color="${color}"]` : "";

  return /* css */ `
    m-button${prefix} {
      background: var(--m-color-${bgColor}-400);
      border-color: var(--m-color-${bgColor}-400);
    }
    m-button${prefix}:not([disabled]):not([loading]):hover,
    m-button${prefix}:not([disabled]):not([loading]):active {
      background: var(--m-color-${bgColor}-500);
      border-color: var(--m-color-${bgColor}-500);
    }
    m-button${prefix}:not([disabled]):not([loading]):focus {
      border-color: #fff;
      box-shadow: 0 0 0 1px var(--m-color-${bgColor}-400), inset 0 0 0 1px var(--m-color-${bgColor}-400);
    }
    m-button${prefix}[variant='ghost'] {
      background: transparent;
      border-color: transparent;
      color: var(--m-color-${color}-500);
    }
    m-button${prefix}[variant='ghost']:not([disabled]):not([loading]):active,
    m-button${prefix}[variant='ghost']:not([disabled]):not([loading]):hover {
      background: var(--m-color-${bgColor}-50);
      border-color: transparent;
      box-shadow: none;
    }
    m-button${prefix}[variant='ghost']:not([disabled]):not([loading]):active:focus,
    m-button${prefix}[variant='ghost']:not([disabled]):not([loading]):hover:focus {
      box-shadow: 0 0 0 1px var(--m-color-${bgColor}-400), inset 0 0 0 1px var(--m-color-${bgColor}-400);
    }
    m-button${prefix}[variant='outline'] {
      background: transparent;
      border-color: var(--m-color-${bgColor}-400);
      color: var(--m-color-${color}-500);
    }
    m-button${prefix}[variant='outline']:not([disabled]):not([loading]):hover,
    m-button${prefix}[variant='outline']:not([disabled]):not([loading]):active {
      background: var(--m-color-${bgColor}-50);
    }
  `;
};

const size = (size: string) => {
  return /* css */ `
    ${size === "medium" ? "m-button," : ""}
    m-button[size='${size}'] {
      border-radius: var(--m-radius-small);
      font-size: var(--m-font-${size});
      height: calc(var(--m-font-${size}) * 1.25);
      line-height: var(--m-line-${size});
      padding: calc(var(--m-spacing-${size}) * 0.5) var(--m-spacing-${size});
    }
  `;
};

const css = /* css */ `
  m-button {
    align-items: center;
    border: 1px solid transparent;
    color: #fff;
    display: inline-flex !important;
    font-family: var(--m-font-family);
    outline: none;
    user-select: none;
    transition: all var(--m-animation-duration);
  }
  m-button[disabled],
  m-button[loading] {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

const sheet = new CSSStyleSheet();

sheet.replaceSync([css, ...colors.map(color), ...sizes.map(size)].join(" "));

export interface Button {
  disabled?: boolean;
  loading?: boolean;
  intent?: ValueOf<typeof Intent>;
  size?: ValueOf<typeof Size>;
  variant?: "ghost" | "outline";
}

export class Button extends Styled(BaseElement) {
  static styles = sheet;

  static get observedAttributes() {
    return ["disabled", "loading", "intent", "size", "variant"];
  }

  properties = {
    disabled: { type: Boolean },
    loading: { type: Boolean },
    intent: { type: String },
    size: { type: String },
    variant: { type: String },
  };

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener("click", this, true);
    this.setAttribute("role", "button");
    this.tabIndex = 0;
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener("click", this, true);
  }

  handleEvent(evt: MouseEvent) {
    if (this.disabled || this.loading) {
      evt.stopImmediatePropagation();
    }
  }

  render() {
    const { loading, slots } = this;
    const color = getComputedStyle(this).getPropertyValue("color");

    return html`
      <m-flex center>
        <m-spinner color=${color || null} ?hidden=${!loading} size="small" />
        <m-flex ?hidden=${loading}>${slots.default}</m-flex>
      </m-flex>
    `;
  }
}

customElements.define("m-button", Button);

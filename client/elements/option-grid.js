import buildShadowRoot from './buildShadowRoot.js';

class OptionGrid extends HTMLElement {
  constructor() {
    super();
    const html = `
        <style>
          :host {
            display: grid;
            grid-template-columns: repeat(5, 1fr);
            grid-gap: var(--spacing-200);
          }
          ::slotted(check-box) {
            display: block;
            width: 100%;
          }
        </style>
        <slot></slot>
        
    `;

    buildShadowRoot(html, this);
    this.addEventListener('change', this.handleChange.bind(this), true);
    this._value;
  }

  static get observedAttributes() {
    return [`add`];
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
    if (attrName === `add`) {
    }
  }

  get add() {
    return this.hasAttribute(`add`);
  }
  set add(val) {
    if (val) this.setAttribute(`add`, true);
    else this.removeAttribute(`add`);
  }

  get value() {
    return this._value;
  }
  set value(val) {
    this._value = val;
  }

  handleChange(e) {
    if (e.target !== this) {
      e.stopPropagation();
      this.value = [...this.childNodes].reduce((a, child) => (child.checked ? [...a, child.textContent] : a), []);
      this.dispatchEvent(new Event('change'), {
        bubbles: true,
        cancelable: true
      });
    }
  }
}

customElements.define('option-grid', OptionGrid);
export default OptionGrid;

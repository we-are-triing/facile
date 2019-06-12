import buildShadowRoot from './buildShadowRoot.js';

class ItemValue extends HTMLElement {
  constructor() {
    super();
    const html = `
      <style>
        :host {
        }
      </style>
      <slot></slot>
      <span></span>
    `;
    buildShadowRoot(html, this);
    this.elems = {
      type: this.shadowRoot.querySelector('span')
    };
  }

  static get observedAttributes() {
    return ['type'];
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
    switch (attrName) {
      case 'type':
        this.elems.type.textContent = newVal;
        break;
      default:
        break;
    }
  }

  get type() {
    return this.getAttribute('type');
  }
  set type(val) {
    if (val) {
      this.setAttribute('type', val);
    } else {
      this.removeAttribute('type');
    }
  }
}

customElements.define('item-value', ItemValue);
export default ItemValue;

import buildShadowRoot from './buildShadowRoot.js';

class TabularDataItem extends HTMLElement {
  constructor() {
    super();
    const html = /* html */ `
      <style>
        :host {
          display: block;
        }
      </style>
      <span></span>
      <slot></slot>
    `;
    buildShadowRoot(html, this);
    this.elems = {
      label: this.shadowRoot.querySelector('span')
    };
  }

  static get observedAttributes() {
    return ['label'];
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
    switch (attrName) {
      case 'label':
        this.elems.label.textContent = newVal;
        break;
      default:
        break;
    }
  }

  get label() {
    return this.getAttribute('label');
  }
  set label(val) {
    if (val) {
      this.setAttribute('label', val);
    } else {
      this.removeAttribute('label');
    }
  }
}

customElements.define('tabular-data-item', TabularDataItem);
export default TabularDataItem;

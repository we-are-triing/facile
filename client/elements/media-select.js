import buildShadowRoot from './buildShadowRoot.js';

class MediaSelect extends HTMLElement {
  constructor() {
    super();
    const html = `
      <style>
        :host {
        }
      </style>
      <slot></slot>
    `;
    buildShadowRoot(html, this);
    this.elems = {
      elem: this.shadowRoot.querySelector('selector')
    };
  }

  static get observedAttributes() {
    return ['sampleAttr'];
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
    switch (attrName) {
      case 'sampleAttr':
        this.elems.elem.setAttribute('sampleAttr', newVal);
        break;
      default:
        break;
    }
  }

  get sampleAttr() {
    return this.getAttribute('sampleAttr');
  }
  set sampleAttr(val) {
    if (val) {
      this.setAttribute('sampleAttr', val);
    } else {
      this.removeAttribute('sampleAttr');
    }
  }
}

customElements.define('media-select', MediaSelect);
export default MediaSelect;

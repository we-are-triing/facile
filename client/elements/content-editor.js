import buildShadowRoot from './buildShadowRoot.js';

class ContentEditor extends HTMLElement {
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
    return ['attr'];
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
    switch (attrName) {
      case 'attr':
        this.elems.elem.setAttribute('attr', newVal);
        break;
      default:
        break;
    }
  }

  get attr() {
    return this.getAttribute('attr');
  }
  set attr(val) {
    if (val) {
      this.setAttribute('attr', val);
    } else {
      this.removeAttribute('attr');
    }
  }
}

customElements.define('content-editor', ContentEditor);
export default ContentEditor;

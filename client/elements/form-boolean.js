import buildShadowRoot from './buildShadowRoot.js';

class FormBoolean extends HTMLElement {
  constructor() {
    super();
    const html = `
      <style>
        :host {
        }
      </style>
      <input type="checkbox" />
    `;
    buildShadowRoot(html, this);
    this.elems = {
      checkbox: this.shadowRoot.querySelector('input')
    };
  }

  static get observedAttributes() {
    return ['on'];
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
    switch (attrName) {
      case 'on':
        this.elems.checkbox.setAttribute('on', newVal);
        break;
      default:
        break;
    }
  }

  get on() {
    return this.getAttribute('on');
  }
  set on(val) {
    if (val) {
      this.setAttribute('on', val);
    } else {
      this.removeAttribute('on');
    }
  }
}

customElements.define('form-boolean', FormBoolean);
export default FormBoolean;

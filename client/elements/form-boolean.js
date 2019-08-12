import buildShadowRoot from './buildShadowRoot.js';
import './check-box.js';

class FormBoolean extends HTMLElement {
  constructor() {
    super();
    const html = /* html */ `
      <style>
        :host {
        }
      </style>
      <check-box><slot></slot></check-box>
    `;
    buildShadowRoot(html, this);
    this.elems = {
      checkbox: this.shadowRoot.querySelector('check-box')
    };
    this.elems.checkbox.addEventListener('change', this.handleChange.bind(this));
  }

  handleChange(e) {
    this.value = e.target.checked;
    this.dispatchEvent(new Event('change', {bubbles: true}));
  }

  static get observedAttributes() {
    return ['value'];
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
    switch (attrName) {
      case 'value':
        this.elems.checkbox.setAttribute('checked', newVal);
        break;
      default:
        break;
    }
  }

  get value() {
    return this.getAttribute('value');
  }
  set value(val) {
    if (val) {
      this.setAttribute('value', val);
    } else {
      this.removeAttribute('value');
    }
  }
}

customElements.define('form-boolean', FormBoolean);
export default FormBoolean;

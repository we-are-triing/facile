import buildShadowRoot from './buildShadowRoot.js';
import './labeled-input.js';

class FormPath extends HTMLElement {
  constructor() {
    super();
    const html = `
      <style>
        :host {
          display: block;
        }
      </style>
      <labeled-input><slot></slot></labeled-input>
      
    `;
    buildShadowRoot(html, this);
    this.elems = {
      input: this.shadowRoot.querySelector('labeled-input')
    };
    this.elems.input.addEventListener('change', this.handleChange.bind(this));
  }

  handleChange(e) {
    this.value = e.target.value;
    this.dispatchEvent(new Event('change', {bubbles: true}));
  }

  static get observedAttributes() {
    return ['value'];
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
    switch (attrName) {
      case 'value':
        this.elems.input.setAttribute('value', newVal);
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

customElements.define('form-path', FormPath);
export default FormPath;

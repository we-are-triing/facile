import buildShadowRoot from './buildShadowRoot.js';
import './labeled-input.js';

class FormObject extends HTMLElement {
  constructor() {
    super();
    const html = /* html */ `
      <style>
        :host {
          display: block;
        }
        span {
          display: block;
          font-weight: 600;
          font-size: var(--font-size-300);
          margin-top: var(--spacing-400);
        }
        textarea {
          width: 80%;
          font-family: var(--mono);
          min-height: 10em;
          font-size: var(--font-size-500);
          background: var(--nero-50);
          border: var(--border);
        }
      </style>
      <span><slot></slot></span>
      <textarea></textarea>
      
    `;
    buildShadowRoot(html, this);
    this.elems = {
      input: this.shadowRoot.querySelector('textarea')
    };
    this.elems.input.addEventListener('change', this.handleChange.bind(this));
  }

  handleChange(e) {
    try {
      this.value = JSON.stringify(JSON.parse(e.target.value));
      this.dispatchEvent(new Event('change', {bubbles: true}));
    } catch (err) {
      console.error('malformed JSON', err);
    }
  }

  static get observedAttributes() {
    return ['value'];
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
    switch (attrName) {
      case 'value':
        this.elems.input.value = newVal;
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

customElements.define('form-object', FormObject);
export default FormObject;

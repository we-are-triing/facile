import buildShadowRoot from './buildShadowRoot.js';
import {down} from '../utils/formattedText.js';
import './labeled-input.js';

class FormText extends HTMLElement {
  constructor() {
    super();
    const html = /* html */ `
      <style>
        :host {
          display: block;
        }
      </style>
      <slot></slot>
      <span></span>
      <textarea></textarea>
      <div></div>
    `;
    buildShadowRoot(html, this);
    this.elems = {
      title: this.shadowRoot.querySelector('span'),
      input: this.shadowRoot.querySelector('textarea'),
      output: this.shadowRoot.querySelector('div')
    };
    this.elems.input.addEventListener('change', this.handleText.bind(this));
  }

  async handleText(e) {
    this.output = await down(e.target.value);
    this.elems.output.innerHTML = this.output;
  }

  static get observedAttributes() {
    return ['name', 'value'];
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
    switch (attrName) {
      case 'name':
        this.elems.name.textContent = newVal;
        break;
      case 'value':
        this.elems.input.value = newVal;
      default:
        break;
    }
  }

  get name() {
    return this.getAttribute('name');
  }
  set name(val) {
    if (val) {
      this.setAttribute('name', val);
    } else {
      this.removeAttribute('name');
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

customElements.define('form-text', FormText);
export default FormText;

import buildShadowRoot from './buildShadowRoot.js';
import './labeled-input.js';
import './media-picker.js';

class FormMedia extends HTMLElement {
  constructor() {
    super();
    const html = /* html */ `
      <style>
        :host {
          display: block;
        }
      </style>
      <media-picker></media-picker>
      
    `;
    buildShadowRoot(html, this);
    this.elems = {
      picker: this.shadowRoot.querySelector('media-picker')
    };
    this.elems.picker.addEventListener('image-change', this.handleChange.bind(this));
  }

  handleChange(e) {
    this.value = this.elems.picker.path;
    this.dispatchEvent(new Event('change', {bubbles: true}));
  }

  static get observedAttributes() {
    return ['value'];
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
    switch (attrName) {
      case 'value':
        this.elems.picker.setAttribute('src', newVal);
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

customElements.define('form-media', FormMedia);
export default FormMedia;

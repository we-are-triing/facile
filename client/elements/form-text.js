import buildShadowRoot from './buildShadowRoot.js';
import './an-editor.js';

class FormText extends HTMLElement {
  constructor() {
    super();
    const html = /* html */ `
      <style>
        :host {
          display: block;
        }
      </style>
      <span><slot></slot></span>
      <an-editor type="inline"></an-editor>
    `;
    buildShadowRoot(html, this);
    this.elems = {
      title: this.shadowRoot.querySelector('span'),
      editor: this.shadowRoot.querySelector('an-editor')
    };
    this.elems.editor.addEventListener('change', this.handleChange.bind(this));
  }

  handleChange(e) {
    this.value = e.detail.markdown;
    this.dispatchEvent(
      new CustomEvent('change', {
        bubbles: true,
        detail: e.detail
      })
    );
  }

  static get observedAttributes() {
    return ['value'];
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
    switch (attrName) {
      case 'value':
        this.elems.editor.value = newVal;
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

customElements.define('form-text', FormText);
export default FormText;

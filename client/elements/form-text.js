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
        span {
          font-weight: 600;
          font-size: var(--font-size-300);
          margin-top: var(--spacing-400);
        }
      </style>
      <span><slot></slot></span>
      <an-editor color="dark" type="inline"></an-editor>
    `;
    buildShadowRoot(html, this);
    this.elems = {
      title: this.shadowRoot.querySelector('span'),
      editor: this.shadowRoot.querySelector('an-editor')
    };
    this.elems.editor.addEventListener('change', this.handleChange.bind(this));
  }

  handleChange(e) {
    this.value = this.elems.editor.output.markdown;
    this.dispatchEvent(
      new Event('change', {
        bubbles: true
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

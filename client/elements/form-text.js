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
  }

  static get observedAttributes() {
    return ['name', 'value'];
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
    switch (attrName) {
      case 'name':
        this.elems.title.textContent = newVal;
        break;
      case 'value':
        this.elems.editor.value = newVal;
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

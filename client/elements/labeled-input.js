import buildShadowRoot from './buildShadowRoot.js';

class LabeledInput extends HTMLElement {
  constructor() {
    super();
    const html = `
      <style>
        :host {
          display: block;
        }
      </style>
      <label for="input"><slot></slot></label>
      <input name="input" type="text"/>
    `;
    buildShadowRoot(html, this);
    this.elems = {
      input: this.shadowRoot.querySelector('input')
    };
  }

  static get observedAttributes() {
    return ['type', 'placeholder'];
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
    switch (attrName) {
      case 'type':
        this.elems.input.setAttribute('type', newVal);
        break;
      case 'placeholder':
        this.elems.input.setAttribute('placeholder', newVal);
        break;
      default:
        break;
    }
  }

  get type() {
    return this.getAttribute('type') || 'text';
  }
  set type(val) {
    if (val) {
      this.setAttribute('type', val);
    } else {
      this.removeAttribute('type');
    }
  }

  get placeholder() {
    return this.getAttribute('placeholder');
  }
  set placeholder(val) {
    if (val) {
      this.setAttribute('placeholder', val);
    } else {
      this.removeAttribute('placeholder');
    }
  }
}

customElements.define('labeled-input', LabeledInput);
export default LabeledInput;

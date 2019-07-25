import buildShadowRoot from './buildShadowRoot.js';

class LabeledInput extends HTMLElement {
  constructor() {
    super();
    const html = /* html */ `
      <style>
        :host {
          display: block;
        }
        :host([no-label]) label{
          display: none;
        }
        * {
          box-sizing: border-box;
        }
        :host([large]) input {
          border: none;
          border-bottom: var(--border);
          border-radius: 0;
        }
        :host([large]) input{
          font-size: 2em;
        }
        input {
          font-size: inherit;
          padding: var(--spacing-100) var(--spacing-200);
          font-family: inherit;
          border: var(--border);
          border-radius: var(--br-400);
          font-weight: 100;
          color: inherit;
          width: 100%;
        }
        input::placeholder {
          color: var(--nero-300);
        }
      </style>
      <label for="input"><slot></slot></label>
      <input name="input" type="text"/>
    `;
    buildShadowRoot(html, this);
    this.elems = {
      input: this.shadowRoot.querySelector('input')
    };
    this.elems.input.addEventListener('change', this.handlChange.bind(this));
  }

  handlChange(e) {
    this.value = this.elems.input.value;
    this.dispatchEvent(
      new Event('change', {
        bubbles: true
      })
    );
  }

  static get observedAttributes() {
    return ['type', 'placeholder', 'value'];
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
    switch (attrName) {
      case 'type':
        this.elems.input.setAttribute('type', newVal);
        break;
      case 'placeholder':
        this.elems.input.setAttribute('placeholder', newVal);
        break;
      case 'value':
        this.elems.input.value = newVal;
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

customElements.define('labeled-input', LabeledInput);
export default LabeledInput;

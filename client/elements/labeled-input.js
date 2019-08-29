import buildShadowRoot from './buildShadowRoot.js';
import debounce from '../utils/debounce.js';

class LabeledInput extends HTMLElement {
  constructor() {
    super();
    const html = /* html */ `
      <style>
        :host {
          display: block;
          margin-top: var(--spacing-300);
        }
        :host([no-label]) {
          margin-top: 0;
        }
        :host([no-label]) label{
          display: none;
        }
        :host([color="dark"]) input{
          background: var(--nero-50);
          border: var(--border);
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
        :host([disabled]) input {
          background: var(--nero-300);
        }
        :host([disabled][large]) input {
          background: var(--bianco);
          border-bottom: none;
        }
        label {
          font-weight: 600;
          font-size: var(--font-size-300);
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

    this.debouncedHandleChange = debounce(this.handleChange).bind(this);
    this.elems.input.addEventListener('keyup', this.debouncedHandleChange);
    this.elems.input.addEventListener('change', this.handleChange.bind(this));
  }

  handleChange(e) {
    this.value = this.elems.input.value;
    this.dispatchEvent(
      new Event('change', {
        bubbles: true
      })
    );
  }

  static get observedAttributes() {
    return ['type', 'placeholder', 'value', 'disabled'];
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
    switch (attrName) {
      case 'disabled':
        if (newVal === '' || newVal) {
          this.elems.input.setAttribute('disabled', '');
        } else {
          this.elems.input.removeAttribute('disabled');
        }
        break;
      case 'type':
        this.elems.input.setAttribute('type', newVal);
        break;
      case 'placeholder':
        this.elems.input.setAttribute('placeholder', newVal);
        break;
      case 'value':
        this.elems.input.value = this.type !== 'date' ? newVal : newVal.split('T')[0];
        break;
      default:
        break;
    }
  }

  get disabled() {
    return this.hasAttribute('disabled');
  }
  set disabled(val) {
    if (val) {
      this.setAttribute('disabled', '');
    } else {
      this.removeAttribute('disabled');
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

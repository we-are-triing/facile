import buildShadowRoot from './buildShadowRoot.js';
import {downline} from '../utils/formattedText.js';
import debounce from '../utils/debounce.js';
import './labeled-input.js';

class FormText extends HTMLElement {
  constructor() {
    super();
    const html = /* html */ `
      <style>
        :host {
          display: block;
        }
        * {
          box-sizing: border-box;
        }
        section {
          display: flex;
          justify-content: space-between;
        }
        section > * {
          width: 100%;
          padding: var(--spacing-200);
        }
        section > div > *:first-child {
          margin-top: 0;
          padding-top: 0;
        }
      </style>
      <span></span>
      <section>
        <textarea></textarea>
        <div></div>
      </section>
    `;
    buildShadowRoot(html, this);
    this.elems = {
      title: this.shadowRoot.querySelector('span'),
      input: this.shadowRoot.querySelector('textarea'),
      output: this.shadowRoot.querySelector('div')
    };
    const debouncedHandleText = debounce(this.handleText).bind(this);
    this.elems.input.addEventListener('keyup', debouncedHandleText);
  }
  // TODO: this will eventually be replaced with a WYSIWYG editor with markdown as it's engine,
  // It will not allow markup.
  // But we need a simple version to begin with.
  async handleText(e) {
    // TODO: Why is the debounce altering the returned event object from the input to this?
    this.output = await downline(this.elems.input.value);
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

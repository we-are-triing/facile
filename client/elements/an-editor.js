import buildShadowRoot from './buildShadowRoot.js';
import {downline, down} from '../utils/formattedText.js';
import debounce from '../utils/debounce.js';
import {sendComponent} from '../utils/services.js';

class AnEditor extends HTMLElement {
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
      <section>
        <textarea></textarea>
        <div></div>
      </section>
    `;
    buildShadowRoot(html, this);
    this.elems = {
      input: this.shadowRoot.querySelector('textarea'),
      output: this.shadowRoot.querySelector('div')
    };
    this.debouncedSend = debounce(this.send).bind(this);
    this.elems.input.addEventListener('keyup', this.debouncedSend);
  }

  async handleText() {
    // TODO: figure out why this is behaving poorly through the debounce.
    let func = this.type === 'inline' ? downline : down;
    this.output = await func(this.elems.input.value);
    this.elems.output.innerHTML = this.output.html;
    this.elems.input.value = this.output.markdown;
  }

  async send() {
    this.handleText();
    this.dispatchEvent(
      new CustomEvent('change', {
        bubbles: true,
        detail: this.output
      })
    );
  }

  static get observedAttributes() {
    return ['value'];
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
    switch (attrName) {
      case 'value':
        this.elems.input.value = newVal;
        this.handleText();
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

  get type() {
    return this.getAttribute('type');
  }
  set type(val) {
    if (val) {
      this.setAttribute('type', val);
    } else {
      this.removeAttribute('type');
    }
  }
}

customElements.define('an-editor', AnEditor);
export default AnEditor;
